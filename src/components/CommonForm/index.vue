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
      v-on="formEvents"
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
                v-on="formItem.componentEvents"
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
// eslint-disable-next-line import/no-extraneous-dependencies
// import 'element-plus/es/components/input/style/css'
// import 'element-plus/es/components/cascader/style/css'
// import 'element-plus/es/components/date-picker/style/css'
// import { Input, Cascader, DatePicker } from 'element-plus';
import Select from '../CommonTable/CommonSelect.vue';

export default {
  name: 'CommonForm',
  components: {
    // Input,
    // Cascader,
    // DatePicker,
    Select
  },
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
  data() {
    return {
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
    };
  },
  watch:{
    formInline: {
      deep:true,
      handler(val){
        // let targetKeys = this.formConfig.formAttrs.requiredKeys
        // targetKeys.forEach(key => {
        //   if(val[key]) {
        //     this.$refs.commonFormRef.clearValidate(key)
        //   } else {
        //     this.$refs.commonFormRef.validateField(key)
        //   }
        // })
      }
    }
  },
  computed: {
    schemaLength() {
      return this.formConfig.schema.length;
    },
    isFlex() {
      return true;
    },
    formAttrs() {
      return this.formConfig.formAttrs || {};
    },
    formEvents() {
      return this.formConfig.formEvents || {};
    },
    showComponent() {
      if (this.currentWidthType === 3) {
        return this.schemaLength >= 8;
      }
      if (this.currentWidthType === 2) {
        return this.schemaLength > 5;
      }
      if (this.currentWidthType === 1) {
        return this.schemaLength > 3;
      }
    },
    showNextLine() {
      if (this.currentWidthType === 3) {
        return this.schemaLength % 8 === 0
      }
      if (this.currentWidthType === 2) {
        return this.schemaLength % 3 === 0
      }
      if (this.currentWidthType === 1) {
        return this.schemaLength % 2 === 0
      }
    }
  },
  created() {},
  mounted() {
    this.setSpan();
    this.func = () => {
      this.$nextTick(() => {
        this.setSpan()
      })
    }
    // 将form派发出去,方便使用refs调用form的方法
    this.$emit('common-form', this.$refs.commonFormRef);
    window.addEventListener('resize',this.func);
    const _this = this
    this.keydownFunc = function({key}) {
      _this.timer && clearTimeout(_this.timer)
      _this.timer = setTimeout(() => {
        const values = Object.values(_this.formInline).filter(el => !!el)
        if(key === 'Enter' && !!values.length) {
          _this.onSubmit()
        }
      },200)
    }
    window.addEventListener('keydown', this.keydownFunc)
  },
  destroyed() {
    window.removeEventListener('resize', this.func);
    window.removeEventListener('keydown', this.keydownFunc)
    this.timer && clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    showIndex(index){
      if(this.currentWidthType === 3) {
        return index >= 7 ? !this.isPackUp : true
      }
      if(this.currentWidthType === 2) {
        return index >= 5 ? !this.isPackUp : true
      }
      if(this.currentWidthType === 1) {
        return index >= 3 ? !this.isPackUp : true
      }
    },
    setSpan() {
      this.createForm = false
      // 获取当前的form的宽度
      const dom = document.querySelector('.common-form');
      if(!dom) return
      const formWidth = dom.offsetWidth;
      // console.log(formWidth,'formWidth');
      this.specialSpan = 0
      if (formWidth > 1200) {
        // console.log('3333333', formWidth, this.schemaLength);
        this.currentWidthType = 3;
        if (this.schemaLength >= 3) {
          this.currentSpan = 6;
          if (this.schemaLength > 3) {
            this.isShowPackBtn = true;
          } else {
            this.isShowPackBtn = false;
          }
        } else {
          this.isShowPackBtn = false;
          if (this.schemaLength === 1) {
            this.currentSpan = 12;
            this.specialSpan = 12
          } else if (this.schemaLength === 2) {
            this.currentSpan = 10;
            this.specialSpan = 4
          }
        }
      }
      if (formWidth > 992 && formWidth <= 1200) {
        console.log('222222', formWidth, this.schemaLength);
        this.currentWidthType = 2;
        if (this.schemaLength >= 6) {
          this.currentSpan = 8;
          this.isShowPackBtn = true;
        } else {
          this.isNextLine = false;
          this.isShowPackBtn = false;
          if (this.schemaLength === 1) {
            this.currentSpan = 12;
          } else if (this.schemaLength === 2) {
            this.currentSpan = 8;
          } else if (this.schemaLength === 3) {
            this.currentSpan = 8;
            this.specialSpan = 24
          } else if (this.schemaLength === 4 || this.schemaLength === 5) {
            this.currentSpan = 8;
          }
        }
      }
      if (formWidth <= 992) {
        this.currentWidthType = 1;
        // console.log('11111111', formWidth, this.schemaLength);
        if (this.schemaLength > 2) {
          this.currentSpan = 12;
          this.isShowPackBtn = true;
        } else {
          this.isNextLine = false;
          this.isShowPackBtn = false;
          if (this.schemaLength === 1) {
            this.currentSpan = 14;
            this.specialSpan = 10
          } else if (this.schemaLength === 2) {
            this.currentSpan = 12;
            this.specialSpan = 24
          }
        }
      }
      // console.log(this.currentSpan,this.specialSpan, 'this.currentSpan');
      this.createForm = true
    },
    toggleNextLine() {
      if (this.currentWidthType === 3) {
        this.currentSpan = 6;
        if(this.schemaLength % 4 === 2 ) {
          this.specialSpan = 12
        }
      }
      this.isNextLine = true;
      this.isPackUp = false;
      this.$emit('refresh-height')
    },
    hideNextLine() {
      if (this.currentWidthType === 3) {
        this.currentSpan = 6;
        if(this.schemaLength % 4 === 2 ) {
          this.specialSpan = 0
        }
      }
      this.isNextLine = false;
      this.isPackUp = true;
      this.$emit('refresh-height')
    },
    onReset() {
      this.formInline = {};
      this.$refs['commonFormRef'].resetFields();
      this.$emit('reset-form');
    },
    onSubmit() {
      this.$refs['commonFormRef'].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.formInline));
          params = {
            ...params,
            ...this.formbind
          }
          if (this.formConfig.beforeSubmit) {
            params = this.formConfig.beforeSubmit(params);
          }
          console.log(params,'------params');
          this.$emit('submit-form', params);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
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
