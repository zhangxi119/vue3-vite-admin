<template>
  <el-card
    shadow="never"
    :class="hasTopNav ? 'box-card down-height' : 'box-card'"
  >
  <div>
    <slot name="topChange"></slot>
  </div>
    <div class="custom-table-main" :class='{empty: tableData.length === 0}'>
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
        <el-table
          ref="tableRef"
          v-loading="isLoading"
          border
          :class=" isTranfer ? 'headBgColor' : ''"
          :data="tableData"

          v-bind="tableAttrs"
          v-on="tableEvents"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="hasSelection" type="selection" width="36">
          </el-table-column>
          <el-table-column v-if="hasIndex" fixed='left' label="序号" width="55" type="index">
            <template slot-scope="scope">
              <span>{{
                (pageParams.pageNo - 1) * pageParams.pageSize + scope.$index + 1
              }}</span>
            </template>
          </el-table-column>
          <template v-for="(item,index) in columns">
            <el-table-column
              v-if='!item.useDefaultSlot'
              :key="item.prop"
              :prop="undefined"
              v-bind="item"
              show-overflow-tooltip
            >
              <template slot-scope="{ row, column }">
                <template v-if="row.inputColumn">
                  <slot :name="item.prop + 'Input'" :columuData="row"></slot>
                </template>
                <template v-else>
                  <slot
                    v-if="item.slotName"
                    :name="item.slotName"
                    :columuData="row"
                  >
                  </slot>
                  <span v-else>{{
                      row[item.prop] | formatFilter(item.formatOptions, item.format0)
                    }}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="item.prop"
              :prop="undefined"
              v-bind="item"
              show-overflow-tooltip
            >
              <slot
                :name="item.slotName"
                :columuData="tableData"
              ></slot>
            </el-table-column>
          </template>
          <div slot="empty">
            <img
              :src="
                hasSearch
                  ? require('@/assets/tableicon/default_pic_nosearch.svg')
                  : require('@/assets/tableicon/default_pic_kong.svg')
              "
              alt=""
            />
            <div>{{ hasSearch ? '无搜索结果' : '暂无数据' }}</div>
          </div>
        </el-table>
        <el-row v-if="isShowPagination" class="pagination-row">
          <el-col
            class="pagination-view"
            style="text-align:right; margin-top:10px;margin-bottom:10px"
            :span="24"
          >
            <span
              v-show="tableData.length"
              :style="{ left: this.showAllLeft + 'px' }"
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
import { Input, DatePicker, Cascader, Progress } from 'element-ui';
import CommonSelect from './CommonSelect';
import CommonForm from '../CommonForm';

export default {
  name: 'CommonTable',
  components: {
    Input,
    Select: CommonSelect,
    Cascader,
    DatePicker,
    CommonForm,
    Progress
  },
  filters: {
    formatFilter(val, list, format0) {
      if(format0) {
        return  val || 0
      }
      if (val == null) return '--';
      if (!list) {
        return val;
      }
      const result = list.find(el => el.value == val);
      return result ? result.label : val;
    },
  },
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
    // 外部传进来的参数，是否是穿梭框中的表格
    isTranfer: {
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
    height: String
  },
  data() {
    return {
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
      tableHeight: '260px',
      hasSearch: false,
    };
  },
  computed: {
    mustSub(){
      // 得到了总页数
      const page = Math.ceil(this.total / this.pageParams.pageSize)
      console.log(page,'page');
      const isLastPage = page === this.pageParams.pageNo && page !== 1
      console.log(isLastPage,'isLastPage');
      if(isLastPage && this.tableData.length === 1) {
        return true
      }
        return false
    },
    tableAttrs() {
      return this.tableConfig.tableAttrs || {};
    },
    tableEvents() {
      return this.tableConfig.tableEvents || {};
    },
    columns() {
      return this.tableConfig.columns || {};
    },
    hasForm() {
      return !!this.tableConfig.hasForm;
    },
    hasFormAndTab() {
      return !!this.tableConfig.hasFormAndTab;
    },
    hasTopNav() {
      // 是否含有导航（改变页面主体高度）
      return !!this.tableConfig.hasTopNav;
    },
    formConfig() {
      return this.tableConfig.formConfig || {};
    },
    formAttrs() {
      return (
        (this.tableConfig.formConfig &&
          this.tableConfig.formConfig.formAttrs) ||
        {}
      );
    },
    formEvents() {
      return (
        (this.tableConfig.formConfig &&
          this.tableConfig.formConfig.formEvents) ||
        {}
      );
    },
    schema() {
      return (
        (this.tableConfig.formConfig && this.tableConfig.formConfig.schema) ||
        []
      );
    },
    hasIndex() {
      return (this.tableConfig && this.tableConfig.hasIndex) || false;
    },
    hasSelection() {
      return (this.tableConfig && this.tableConfig.hasSelection) || false;
    },
    startPage() {
      return (this.pageParams.pageNo - 1) * this.pageParams.pageSize + 1;
    },
    endPage() {
      return this.tableData.length < this.pageParams.pageSize
        ? this.startPage + this.tableData.length - 1
        : this.startPage + this.pageParams.pageSize - 1;
    },

  },
  watch: {
    // 外部切换，不一定需要重置表单区域的筛选条件
    queryParams: {
      deep: true,
      handler(newParams) {
        console.log(newParams)
        if (this.isResetForm) {
          this.onReset();

        } else {
          this.resetTable();
        }
      },
    },

    searchParams: {
      deep: true,
      immediate: true,
      handler(newParams) {
        const len = Array.from(Object.keys(newParams));
        if (len.length > 0) {
          this.hasSearch = true;
        } else {
          this.hasSearch = false;
        }
      },
    },
    tableData(val){
      this.layout()
    }
  },
  mounted() {
    // 计算left
    if(this.isShowPagination) {
      const pageEl = document.querySelector('.el-pagination__total');
      this.showAllLeft = pageEl.offsetWidth + 20;
      // 将表格实例emit出去，方便在外面直接调用表格的方法
      this.$emit('get-table-ref', this.$refs.tableRef);
      // 将表单的ref实例，发送到父组件，用以操作表单组件中的方法和值
      this.$emit('getCommonFormRef', this.$refs.CommonFormRef);
    } else {
      // 将表格实例emit出去，方便在外面直接调用表格的方法
      this.$emit('get-table-ref', this.$refs.tableRef);
      // 将表单的ref实例，发送到父组件，用以操作表单组件中的方法和值
      this.$emit('getCommonFormRef', this.$refs.CommonFormRef);
    }

  },
  created() {
    this.isFastRequest && this.getTableData();
  },
  methods: {
    // pageSize自动减一 然后请求
    getSubRefresh(){
      console.log(this.mustSub, 'mustSub');
      if(this.mustSub){
        this.pageParams.pageNo -= 1
      }
      this.getTableData()
    },
    handleSelectionChange(val){
       this.selectList = val
       this.$bus.$emit('chooseList', this.selectList)
    },
    emitCommmonForm(refs) {
      // 将表单实例emit出去
      this.hasForm && this.$emit('get-form-ref', refs);
    },
    getTableHeight() {
      const mainEl = document.querySelector('.table-header-main');
      const headerEl = document.querySelector('.table-header');
      const rowEl = document.querySelector('.pagination-row');
      const tableEl = this.$refs.tableRef.$el;
      if(this.isShowPagination) {
        this.tableHeight = `${mainEl.offsetHeight -
          headerEl.offsetHeight -
          rowEl.offsetHeight}px`;
        tableEl.style.height = this.tableHeight;
        console.log(this.tableHeight, 'this.tableHeight');
        this.$refs.tableRef.doLayout();
      } else {
        this.tableHeight = `${mainEl.offsetHeight -
          headerEl.offsetHeight}px`;
        console.log(this.tableHeight, 'this.tableHeight');
        tableEl.style.height = this.tableHeight;
        this.$refs.tableRef.doLayout();
      }
    },
    doLayout() {
      this.getTableHeight();
    },
   layout(){
      this.$nextTick(()=>{
        this.$refs.tableRef.doLayout()
      })
   },
    // 切换size
    handleSizeChange(size) {
      this.pageParams.pageNo = 1;
      this.pageParams.pageSize = size;
      this.getTableData();
    },
    // 切换num
    handleCurrentChange(num) {
      this.pageParams.pageNo = num;
      this.getTableData();
    },
    // 获取表格数据
    getTableData() {
      if (this.tableConfig.api && typeof this.tableConfig.api === 'function') {
        this.isLoading = true;
        // console.log(this.searchParams,"this.searchParams")
        console.log(this.queryParams,"this.queryParams")
        console.log('表格提交的参数是：', {
          ...this.pageParams,
          ...this.queryParams,
          ...this.searchParams,
        });
        this.tableConfig
          .api({
            ...this.pageParams,
            ...this.queryParams,
            ...this.searchParams,
          })
          .then(res => {
            console.log(res.data,"res")
            this.tableData = res.data
              ? res.data[this.listKey]
              : res.result[this.listKey];
              console.log(this.listKey)
              console.log("thistable",this.tableData)
              console.log(this.startPage,this.endPage)
            if (res.data) {
              this.tableData = res.data[this.listKey];
            } else if (res.result[this.listKey]) {
              this.tableData = res.result[this.listKey];
            } else {
              this.tableData = res.result.data;
            }
            this.total = res.data
              ? res.data[this.totalKey]
              : res.result[this.totalKey];
            this.$nextTick(() => {
              if(this.isShowPagination) {
                const pageEl = document.querySelector('.el-pagination__total');
                this.showAllLeft = pageEl.offsetWidth + 20;
                this.getTableHeight();
              } else {
                this.getTableHeight();
              }


            });
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    // 重置表格数据
    resetTable() {
      this.pageParams.pageNo = 1;
      this.getTableData();
    },
    onReset() {
      this.searchParams = {};
      this.formInlineForm = {};

      this.resetTable();
      // 触发发法重置
      this.$emit("reset")
    },
    onSubmit() {
      const submitParams = JSON.parse(JSON.stringify(this.formInlineForm));
      this.searchParams = { ...submitParams };
      this.pageParams.pageNo = 1;
      this.getTableData();
    },
    submitForm(params) {
      console.log(params, 88888833333);
      this.formInlineForm = params;
      this.onSubmit();
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-table-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  //&.empty {
  //  :deep .el-table__body-wrapper{
  //    height: 85%;
  //    .el-table__empty-block{
  //      height: 90% !important;
  //    }
  //  }
  //}
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
  //:deep .el-table__body-wrapper{
  //  height: 88%;
  //  .el-table__empty-block{
  //    height: 90% !important;
  //  }
  //}
  :deep .el-card__body {
    padding: 0;
    height: 100%;
  }
  :deep .el-pagination {
    padding: 2px 10px;
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
  //height: calc(100% - 50px);
}
.el-table--border {
  border-left: transparent;
  &::after{
    background: transparent;
  }
}
.headBgColor.el-table {
  th {
    background: #FAFAFB !important;
  }
}
// 表头背景色 #f0f2f5 文字颜色 #202123
// 右边框颜色 #cfcfcf 下边框颜色 #eff2f7
// table hover #afd7fd
</style>
