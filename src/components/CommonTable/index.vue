<template>
  <el-card
    shadow="never"
    :class="hasTopNav ? 'box-card down-height' : 'box-card'"
  >
    <div class="custom-table-main">
      <div
        v-if="hasForm"
        class="table-search"
        :class="{ custom: customSearch }"
      >
        <div v-if="hasFormAndTab" class="big-tab">
          <slot name="bigTypeTab"></slot>
        </div>
        <div style="position:relative;">
          <CommonForm
            ref="CommonFormRef"
            :form-config="formConfig"
            :formbind="formbind"
            @submit-form="submitForm"
            @reset-form="onReset"
            @common-form="emitCommmonForm"
          >
            <template
              v-for="slotItem in formConfig.schema"
              v-slot:[slotItem.slotName]="{ formInline }"
            >
              <slot :name="slotItem.slotName" :formInline="formInline"></slot>
            </template>
          </CommonForm>
        </div>
      </div>
      <div class="table-header-main">
        <div class="table-header">
          <slot name="header"></slot>
        </div>
        <div class="table-change">
          <slot name="tableChange"></slot>
        </div>
        <!-- v-on="tableEvents" -->
        <el-table
          ref="tableRef"
          v-loading="isLoading"
          border
          :data="tableData"
          :height="tableHeight"
          v-bind="tableAttrs"
          :row-key="rowKey"
          @selection-change="handleSelectionChange"
          @header-dragend="headerDragend"
        >
          <el-table-column fixed='left' v-if="hasSelection" type="selection" width="55" :reserve-selection="rowKey ? true : false">
          </el-table-column>
          <el-table-column  fixed='left' v-if="hasIndex" label="序号" width="55" type="index">
            <template #default="scope">
              <span>{{
                (pageParams.pageNo - 1) * pageParams.pageSize + scope.$index + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.prop"

            :prop="undefined"
            v-bind="item"
            show-overflow-tooltip
            :resizable="true"
          >
            <template #default="{ row }">
              <template v-if="row.inputColumn">
                <slot :name="item.prop + 'Input'" :columuData="row"></slot>
              </template>
              <template v-else>
                <slot
                  v-if="item.slotName"
                  :name="item.slotName"
                  :columuData="row"
                ></slot>
                <span v-else-if="item.formatter">{{
                    item.formatter(row[item.prop], row)
                  }}</span>
                <span v-else>{{
                    row[item.prop] || formatFilter(item.formatOptions)
                }}</span>
              </template>
            </template>
          </el-table-column>
          <!-- <div slot="empty"> -->
          <template #empty>
            <div>
              <img
                :src="
                  hasSearch
                    ? nosearch
                    : emptImg
                "
                alt=""
              />
              <div>{{ hasSearch ? '无搜索结果' : '暂无数据' }}</div>
            </div>
          </template>
        </el-table>
        <el-row v-if="isShowPagination" class="pagination-row">
          <el-col
            class="pagination-view"
            style="text-align:right; margin-top:10px;margin-bottom:10px"
            :span="24"
          >
            <span
              v-show="tableData.length"
              :style="{ left: showAllLeft + 'px' }"
              class="show-page-num"
              >显示{{ startPage }}-{{ endPage }}条</span
            >
            <el-pagination
              background
              :current-page="pageParams.pageNo"
              :page-sizes="pageSizes"
              :page-size="pageParams.pageSize"
              layout="total,prev,pager,next,sizes,jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-card>
</template>

<script>
import CommonForm from '../CommonForm/index.vue';
import { API_CODE_OK } from '../../constants/AppConstants';
import nosearch from '@/assets/tableicon/default_pic_nosearch.svg'
import emptImg from '@/assets/tableicon/default_pic_kong.svg'

import { defineComponent, reactive, toRefs, computed, ref, nextTick, watch, onMounted } from 'vue'

export default defineComponent({
  name: 'CommonTable',

  props: {
    customSearch: {
      type: Boolean,
      default: false,
    },
    // 是一个必传属性
    tableConfig: {
      type: Object,
      required: true,
      validator(config) {
        // console.log(config, 'config');
        if (typeof config !== 'object' && config !== null) {
          console.error('tableConfig必须是一个对象');
          return false;
        }
        if (!config.api || typeof config.api !== 'function') {
          console.error('config中必须具有api属性，且必须是一个函数');
          return false;
        }
        if (!config.columns || !Array.isArray(config.columns)) {
          console.error('config中必须具有columns属性，且必须是一个对象');
          return false;
        }
        return true;
      },
    },
    // 接口返回的代表列表的字段名，默认是rows
    listKey: {
      type: String,
      default: 'records',
    },
    // 代表总数的字段名，默认是total
    totalKey: {
      type: String,
      default: 'total',
    },
    // 分页器的pageSizes选项
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100];
      },
    },
    // 搜索 重置按钮位置
    isLayoutPosition: {
      type: Boolean,
      default: false,
    },
    // 外部传进来的params，这里主要是非表单区域的参数
    queryParams: {
      type: Object,
      default() {
        return {};
      },
    },
    formbind: {
      type: Object,
      default() {
        return {};
      },
    },
    // 外部传进来的参数，是否重置表单区域
    isResetForm: {
      type: Boolean,
      default: false,
    },
    // form表单区域的输入框等组件的宽度是否是100%
    widthAll: {
      type: Boolean,
      default: true,
    },
    // 是否显示分页功能
    isShowPagination: {
      type: Boolean,
      default: true,
    },
    // 是否是输入框
    inputColumn: {
      type: Boolean,
      default: false,
    },
    // 是否立马进行table请求
    isFastRequest: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    CommonForm
  },
  setup(props, { emit }) {
    const state = reactive({
      tableData: [],
      selectList:[],
      pageParams: {
        pageSize: 10,
        pageNo: 1,
      },
      total: 0,
      formInlineForm: {},
      searchParams: {},
      isLoading: false,
      showAllLeft: 100,
      tableHeight: '300px',
      hasSearch: false,
      nosearch,
      emptImg
    })

    // refs 属性定义
    const tableRef = ref()
    const CommonFormRef = ref()
    // const setTableRef = el => {
    //   tableRef.value = el
    // }
    
    // --------------计算属性--------------- //
    const mustSub = computed(() => {
      // 得到了总页数
      const page = Math.ceil(state.total / state.pageParams.pageSize)
      console.log(page,'page');
      const isLastPage = page === state.pageParams.pageNo && page !== 1
      console.log(isLastPage,'isLastPage');
      if(isLastPage && state.tableData.length === 1) {
        return true
      }
        return false
    });

    const tableAttrs = computed(() => props.tableConfig.tableAttrs || {});

    // vue3.0已经废弃v-on: $listener 这种形式的事件挂在，直接将事件放到tableAttrs中
    const tableEvents = computed(() => props.tableConfig.tableEvents || {});

    const columns = computed(() => props.tableConfig.columns || {});

    const hasForm = computed(() => !!props.tableConfig.hasForm);

    const hasFormAndTab = computed(() => !!props.tableConfig.hasFormAndTab);

    const hasTopNav = computed(() => !!props.tableConfig.hasTopNav);

    const formConfig = computed(() => props.tableConfig.formConfig || {});

    const formAttrs = computed(() => (
      (props.tableConfig.formConfig &&
        props.tableConfig.formConfig.formAttrs) ||
      {}
    ));

    const formEvents = computed(() => (
      (props.tableConfig.formConfig &&
        props.tableConfig.formConfig.formEvents) ||
      {}
    ));

    const schema = computed(() => (
      (props.tableConfig.formConfig &&
        props.tableConfig.formConfig.schema) ||
      {}
    ));

    const hasIndex = computed(() => (props.tableConfig && props.tableConfig.hasIndex) || false);
    
    const hasSelection = computed(() => (props.tableConfig && props.tableConfig.hasSelection) || false);

    const startPage = computed(() => (state.pageParams.pageNo - 1) * state.pageParams.pageSize + 1);

    const endPage = computed(() => {
      return state.tableData.length < state.pageParams.pageSize
        ? startPage + state.tableData.length - 1
        : startPage + state.pageParams.pageSize - 1;
    });

    const rowKey = computed(() => props.tableConfig.selecttionRowKey || '');
    // --------------计算属性结束--------------- //

    // --------------函数方法--------------- //

    function formatFilter(val, list) {
      if (val == null) return '-';
      if (!list) {
        return val;
      }
      const result = list.find(el => el.value == val);
      return result ? result.label : val;
    }

    function getSubRefresh(){
      if(mustSub){
        state.pageParams.pageNo -= 1
      }
      getTableData()
    }

    function handleSelectionChange(val){
       state.selectList = val
       // 抛出跨页多选值
       emit('handleSelectionChange', val);
    }

    function emitCommmonForm(refs) {
      // 将表单实例emit出去
      hasForm && emit('get-form-ref', refs);
    }

    const getTableHeight = async () => {
      await nextTick()
      const mainEl = document.querySelector('.table-header-main');
      const headerEl = document.querySelector('.table-header');
      const rowEl = document.querySelector('.pagination-row');
      const tableEl = tableRef.value.$el;
      state.tableHeight = `${mainEl.offsetHeight - 30 -
        headerEl.offsetHeight -
        rowEl.offsetHeight}px`;
      tableEl.style.height = state.tableHeight;
      tableRef.value.doLayout();
    }

    function doLayout() {
      getTableHeight();
    }

    function layout(){
      nextTick(()=>{
        tableRef.value.doLayout()
      })
    }

    // 拖动表头后重绘
    function headerDragend() {
      tableRef.value.doLayout()
    }

    // 切换size
    function handleSizeChange(size) {
      state.pageParams.pageNo = 1;
      state.pageParams.pageSize = size;
      getTableData();
    }

    function handleCurrentChange(num) {
      state.pageParams.pageNo = num;
      getTableData();
    }

    // 获取表格数据
    function getTableData() {
      if (props.tableConfig.api && typeof props.tableConfig.api === 'function') {
        state.isLoading = true;
        // console.log(this.searchParams,"this.searchParams")
        console.log(props.queryParams,"this.queryParams666")
        console.log('表格提交的参数是：', {
          ...state.pageParams,
          ...props.queryParams,
          ...state.searchParams,
        });
        const params = {
          ...state.pageParams,
          ...props.queryParams,
          ...state.searchParams,
        }
        props.tableConfig
          .api(params)
          .then(res => {
            console.log(res, '-----------tabe-res')
            console.log(API_CODE_OK,'API_CODE_OKAPI_CODE_OKAPI_CODE_OKAPI_CODE_OKAPI_CODE_OK')
            if(res.code !== API_CODE_OK) {
              console.log(res.message)
              ElMessage.error(res.message)
              return
            }
            console.log(res.data[props.listKey],"res")
            state.tableData = res.data
              ? res.data[props.listKey]
              : res.result[props.listKey];
              console.log("thistable",state.tableData)
            if (res.data) {
              state.tableData = res.data[props.listKey];
            } else if (res.result[props.listKey]) {
              state.tableData = res.result[props.listKey];
            } else {
              state.tableData = res.result.data;
            }
            state.total = res.data
              ? res.data[props.totalKey]
              : res.result[props.totalKey];
            nextTick(() => {
              const pageEl = document.querySelector('.el-pagination__total');
              state.showAllLeft = pageEl.offsetWidth + 20;
              getTableHeight();
            });
          })
          .finally(() => {
            state.isLoading = false;
          });
      }
    }

    function resetTable() {
      state.pageParams.pageNo = 1;
      getTableData();
    }

    function onReset() {
      state.searchParams = {};
      state.formInlineForm = {};
      resetTable();
      // 触发发法重置
      emit("reset")
    }

    function onSubmit() {
      const submitParams = JSON.parse(JSON.stringify(state.formInlineForm));
      state.searchParams = { ...submitParams };
      console.log(JSON.parse(JSON.stringify(state.searchParams)), 'searchParams');
      state.pageParams.pageNo = 1;
      getTableData();
    }

    function submitForm(params) {
      state.formInlineForm = params;
      onSubmit();
    }
    // -------------函数方法结束--------------- //
    
    watch(() => props.queryParams, val => {
      if (isResetForm) {
        onReset();
      } else {
        resetTable();
      }
    }, { deep: true })

    watch(() => state.searchParams, val => {
      const len = Array.from(Object.keys(val));
      if (len.length > 0) {
        state.hasSearch = true;
      } else {
        state.hasSearch = false;
      }
    }, { deep: true, immediate: true })

    watch(() => state.tableData, val => {
      layout()
    })

    // 挂载
    onMounted(() => {
      // 计算left
      const pageEl = document.querySelector('.el-pagination__total');
      state.showAllLeft = pageEl.offsetWidth + 20;
      // 将表格实例emit出去，方便在外面直接调用表格的方法
      emit('get-table-ref', tableRef);
      // 将表单的ref实例，发送到父组件，用以操作表单组件中的方法和值
      emit('getCommonFormRef', CommonFormRef);
    })

    // 初始化调用
    props.isFastRequest && getTableData();

    return {
      // 计算属性
      mustSub,
      tableAttrs,
      tableEvents,
      columns,
      hasForm,
      hasFormAndTab,
      hasTopNav,
      formAttrs,
      formEvents,
      schema,
      hasIndex,
      hasSelection,
      startPage,
      endPage,
      formConfig,
      rowKey,
      // 函数方法
      formatFilter,
      getSubRefresh,
      handleSelectionChange,
      emitCommmonForm,
      getTableHeight,
      doLayout,
      layout,
      headerDragend,
      handleSizeChange,
      handleCurrentChange,
      getTableData,
      resetTable,
      onReset,
      onSubmit,
      submitForm,
      
      tableRef, 
      CommonFormRef,
      ...toRefs(state)
    }
  }
})


</script>

<style lang="scss" scoped>
.custom-table-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  img {
    cursor: pointer;
  }
  :deep .el-table__empty-text {
    line-height: 1;
  }
  .table-search {
    width: 100%;
    // background: #fff;
    box-sizing: border-box;
    // padding: 0 20px;
    // padding-top: 18px;
    // margin: 14px 16px;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    margin-bottom: 14px;
    .big-tab {
      margin: -17px -20px 10px -20px;
      padding: 0 20px;
      border-bottom: 1px solid #dcdfe6;
      position: relative;
    }
    &.custom {
      width: 100%;
    }
  }
  .table-header-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    overflow: hidden;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding-left: 26px;
    padding: 20px;
    padding-bottom: 0px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    .el-row {
      width: 100%;
    }
  }
  .table-header {
    width: 100%;
    margin-bottom: 10px;
  }
  .table-change {
    width: 100%;
    // margin-bottom: 10px;
  }
  .layout {
    position: absolute;
    right: -10px;
    text-align: right;
  }
}
.box-card {
  background: transparent;
  border: none;
  height: 100%;
  box-sizing: border-box;
  // padding: 16px;
  // padding-bottom: 10px;
  :deep .el-card__body {
    padding: 0;
    height: 100%;
  }
  :deep .el-pagination {
    padding: 2px 10px;
    float: right;
    .el-pagination__total {
      float: left;
      color: #303133;
    }
  }
  .pagination-view {
    position: relative;
    .show-page-num {
      font-size: 13px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 100px;
      line-height: 28px;
      vertical-align: top;
      color: #303133;
    }
  }
}
.down-height {
  height: calc(100% - 50px);
}
.el-table--border {
  border-left: transparent;
  &::after{
    background: transparent;
  }
}
.custom-table-main :deep .link-item a {
  padding-right: 10px;
}
:deep .el-scrollbar__view {
  height: 100%;
}
// 表头背景色 #f0f2f5 文字颜色 #202123
// 右边框颜色 #cfcfcf 下边框颜色 #eff2f7
// table hover #afd7fd
</style>