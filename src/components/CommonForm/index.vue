<template>
  <div class="common-form">
    <el-form
      v-if="createForm"
      ref="commonFormRef"
      :inline="true"
      v-bind="formAttrs"
      :label-width="formAttrs.labelWidth ?formAttrs.labelWidth : '118px'"
      :model="formInline"
      class="common-form-inline"
    >
      <el-row
        class="not-padding"
        :type="isFlex ? 'flex' : ''"
      >
        <!-- <slot name="disable" :currentSpan="currentSpan" :formInline="formInline"></slot> -->
        <template v-for="(formItem, index) in formConfig.schema" :key="formItem.field">
          <el-col
            v-show="showIndex(index)"
            :span="currentSpan"
          >
            <el-form-item
              :label="formItem.label"
              :prop="formItem.field"
              v-bind="formItem.attrs"

            >
              <slot
                v-if="formItem.slotName"
                :name="formItem.slotName"
                :formInline="formInline"

              ></slot>
              <component
                :is="formItem.component"
                v-else
                v-model:selectValue="formInline[formItem.field]"
                v-bind="formItem.componentProps"
              ></component>
            </el-form-item>
          </el-col>
        </template>
        <el-col style="text-align: right;" :span="currentWidthType === 3 && schemaLength === 4 ? 24 : currentWidthType === 3 && schemaLength === 6 ? 12 :  specialSpan ? specialSpan : currentSpan">
          <el-form-item v-if="!isNextLine || !(isNextLine && showNextLine)">
            <el-button v-if="!isNextLine && showComponent" @click="toggleNextLine"
            >展 开<i class="el-icon-arrow-down el-icon--right"></i
            ></el-button>
            <el-button v-if="showComponent && isNextLine && !showNextLine" @click="hideNextLine"
            >收 起 <i class="el-icon-arrow-up el-icon--right"></i
            ></el-button>
            <el-button @click="onReset">重 置</el-button>
            <el-button type="primary" @click.enter.prevent="onSubmit">查 询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        v-if="isNextLine && showNextLine"
        class="next-line-form-item"
        style="text-align: right;"
      >
        <el-button v-if="!isPackUp && showComponent" @click="hideNextLine"
          >收 起 <i class="el-icon-arrow-up el-icon--right"></i
        ></el-button>
        <el-button v-if="isPackUp && showComponent" @click="toggleNextLine"
          >展 开<i class="el-icon-arrow-down el-icon--right"></i
        ></el-button>
        <el-button @click="onReset">重 置</el-button>
        <el-button type="primary" @click.enter.prevent="onSubmit">查 询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Select from '../CommonTable/CommonSelect.vue';
import { reactive, ref, onMounted, onUnmounted, computed, nextTick, watch, defineComponent, toRefs } from 'vue'

export default defineComponent({
  name: 'CommonForm',
  components: { Select },
  props: {
    formConfig: {
      type: Object,
      default() {
        return {
          schema: [],
        };
      },
    },
    formbind: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  
  setup(props, { emit }) {
    
    const state = reactive({
      formInline: {},
      // el-col当前所占的比例
      currentSpan: 7,
      // 1代表小于等于992 2代表大于992小于1200 3代表大于1200
      currentWidthType: 3,
      // 按钮组是否另起一行
      isNextLine: false,
      // 是否在收起状态
      isPackUp: true,
      // 是否展示收起按钮
      isShowPackBtn: true,
      specialSpan: 0,
      createForm: false,
      timer: null
    })
    const commonFormRef = ref()

    // 计算属性
    const schemaLength = computed(() => props.formConfig.schema.length)

    const isFlex = computed(() => true)

    const formAttrs = computed(() => props.formConfig.formAttrs || {})

    const formEvents = computed(() => props.formConfig.formEvents || {})

    const showComponent = computed(() => {
      if (state.currentWidthType === 3) {
        return schemaLength >= 8;
      }
      if (state.currentWidthType === 2) {
        return schemaLength > 5;
      }
      if (state.currentWidthType === 1) {
        return schemaLength > 3;
      }
    })

    const showNextLine = computed(() => {
      if (state.currentWidthType === 3) {
        return schemaLength % 8 === 0
      }
      if (state.currentWidthType === 2) {
        return schemaLength % 3 === 0
      }
      if (state.currentWidthType === 1) {
        return schemaLength % 2 === 0
      }
    })

    // 函数
    function showIndex(index){
      if(state.currentWidthType === 3) {
        return index >= 7 ? !state.isPackUp : true
      }
      if(state.currentWidthType === 2) {
        return index >= 5 ? !state.isPackUp : true
      }
      if(state.currentWidthType === 1) {
        return index >= 3 ? !state.isPackUp : true
      }
    }
    
    function setSpan() {
      console.log(schemaLength.value, '--------props');
      state.createForm = false
      // 获取当前的form的宽度
      const dom = document.querySelector('.common-form');
      if(!dom) return
      const formWidth = dom.offsetWidth;
      // console.log(formWidth,'formWidth');
      state.specialSpan = 0
      if (formWidth > 1200) {
        // console.log('3333333', formWidth, this.schemaLength);
        state.currentWidthType = 3;
        if (schemaLength >= 3) {
          state.currentSpan = 6;
          if (schemaLength > 3) {
            state.isShowPackBtn = true;
          } else {
            state.isShowPackBtn = false;
          }
        } else {
          state.isShowPackBtn = false;
          if (schemaLength === 1) {
            state.currentSpan = 12;
            state.specialSpan = 12
          } else if (schemaLength === 2) {
            state.currentSpan = 10;
            state.specialSpan = 4
          }
        }
      }
      if (formWidth > 992 && formWidth <= 1200) {
        console.log('222222', formWidth, schemaLength);
        state.currentWidthType = 2;
        if (schemaLength >= 6) {
          state.currentSpan = 8;
          state.isShowPackBtn = true;
        } else {
          state.isNextLine = false;
          state.isShowPackBtn = false;
          if (schemaLength === 1) {
            state.currentSpan = 12;
          } else if (schemaLength === 2) {
            state.currentSpan = 8;
          } else if (schemaLength === 3) {
            state.currentSpan = 8;
            state.specialSpan = 24
          } else if (schemaLength === 4 || schemaLength === 5) {
            state.currentSpan = 8;
          }
        }
      }
      if (formWidth <= 992) {
        state.currentWidthType = 1;
        // console.log('11111111', formWidth, this.schemaLength);
        if (schemaLength > 2) {
          state.currentSpan = 12;
          state.isShowPackBtn = true;
        } else {
          state.isNextLine = false;
          state.isShowPackBtn = false;
          if (schemaLength === 1) {
            state.currentSpan = 14;
            state.specialSpan = 10
          } else if (schemaLength === 2) {
            state.currentSpan = 12;
            state.specialSpan = 24
          }
        }
      }
      // console.log(this.currentSpan,this.specialSpan, 'this.currentSpan');
      state.createForm = true
    }

    function toggleNextLine() {
      if (state.currentWidthType === 3) {
        state.currentSpan = 6;
        if(schemaLength % 4 === 2 ) {
          state.specialSpan = 12
        }
      }
      state.isNextLine = true;
      state.isPackUp = false;
      emit('refresh-height')
    }

    function hideNextLine() {
      if (state.currentWidthType === 3) {
        state.currentSpan = 6;
        if(schemaLength % 4 === 2 ) {
          state.specialSpan = 0
        }
      }
      state.isNextLine = false;
      state.isPackUp = true;
      emit('refresh-height')
    }

    function onReset() {
      state.formInline = {};
      commonFormRef.value.resetFields();
      emit('reset-form');
    }

    function onSubmit() {
      commonFormRef.value.validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(state.formInline));
          params = {
            ...params,
            ...props.formbind
          }
          if (props.formConfig.beforeSubmit) {
            params = props.formConfig.beforeSubmit(params);
          }
          console.log(params,'------params');
          emit('submit-form', params);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }

    let timer = reactive()
    const func = () => {
      nextTick(() => {
        setSpan()
      })
    }
    const keydownFunc = ({key}) => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        const values = Object.values(state.formInline).filter(el => !!el)
        if(key === 'Enter' && !!values.length) {
          onSubmit()
        }
      },200)
    }  

    onMounted(() => {
      setSpan();
      // 将form派发出去,方便使用refs调用form的方法
      emit('common-form', commonFormRef.value);
      window.addEventListener('resize',func);
      window.addEventListener('keydown', keydownFunc)
    }),

    onUnmounted(() => {
      window.removeEventListener('resize', func);
      window.removeEventListener('keydown', keydownFunc)
      timer && clearTimeout(timer)
      timer = null
    })

    return {
      // 计算属性
      schemaLength,
      isFlex,
      formAttrs,
      formEvents,
      showComponent,
      showNextLine,
      // 函数
      showIndex,
      setSpan,
      toggleNextLine,
      hideNextLine,
      onReset,
      onSubmit,
      func,
      keydownFunc,

      commonFormRef,

      ...toRefs(state)
    }
  }
})



</script>

<style lang="scss" scoped>
.common-form {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 20px 0 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  .common-form-inline {
    position: relative;
    width: 100%;
    &.width-type-3 {
      :deep .el-row {
        padding-right: 300px;
        .el-col {
          //flex: 1;
        }
      }
      &.width-type-normal {
        :deep .el-row {
          padding-right: 300px;
          .el-col {
            //flex: auto;
          }
        }
      }
    }
    :deep .el-row {
      box-sizing: border-box;
      padding-right: 300px;
      &.not-pack-btn {
        padding-right: 230px;
      }
      &.not-padding {
        flex-wrap: wrap;
        justify-content: space-between;
        padding-right: 0;
      }
    }
    .next-line-form-item {
      box-sizing: border-box;
      //padding-right: 5px;
      padding-bottom: 15px !important;
      margin-bottom: 0 !important;
    }
    :deep .el-form-item {
      display: flex;
      width: 100%;
      margin-bottom: 16px;
      &.btns {
        position: absolute;
        top: 0px;
        right: 0px;
        max-width: 300px;
        .el-form-item__content {
          text-align: right;
          width: 100%;
        }
      }
      .el-form-item__content {
        //min-width: 201px;
        flex: 1;
        .el-select,
        .el-cascader {
          width: 100%;
        }
      }
    }
  }
}
</style>