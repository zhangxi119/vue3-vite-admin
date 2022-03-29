<template>
  <el-cascader
    v-model="selectValue"
    class="area-cascader"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :popper-class="popperClass"
    :props="dataProps"
    :options="options"
    @expand-change="expandChange"
    @focus="focus"
  ></el-cascader>
</template>

<script>
import { API_CODE_OK } from '@/constants/AppConstants';

export default {
  name: 'AreaCascader',
  props: {
    value: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Object,
      default() {
        return {
          value: 'provinceCode',
          label: 'provinceName',
        };
      },
    },
    service: {
      type: Function,
      required: true,
    },
    readySearch: {
      type: Boolean,
      default: true,
    },
    searchColumn: {
      type: String,
      default: 'parentCode',
    },
    popperClass: {
      type: String,
      default: 'area-cascader-pop',
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const that = this;
    return {
      editting: that.edit,
      dataProps: {
        lazy: !that.editting,
        lazyLoad(node, resolve) {
          that.loadOption(node, resolve);
        },
        value: that.column.value,
        label: that.column.label,
        children: 'umProvinceInfos',
        checkStrictly: true,
      },
      options: [],
      catchValue: [],
    };
  },
  computed: {
    selectValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
      },
    },
  },
  watch: {
    selectValue(val) {
      console.log('sv>>', val);
    },
    value(val) {
      console.log('v>>', val);
    },
    options: {
      deep: true,
      handler(val) {
        console.log(val, 'valllllll');
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    focus() {
      console.log(1);
      this.editting = false;
    },
    expandChange(code) {
      console.log('ex', code);
    },
    change(code) {
      console.log('change>>>code>>>>>', code);

      this.getData(code[code.length - 1]);
    },
    getData(code = '') {
      this.service({
        [this.searchColumn]: code,
      }).then(res => {
        if (res.code === API_CODE_OK) {
          console.log(res);
          this.dataOptions(res.data, code);
        }
      });
    },
    dataOptions(arr, code) {
      if (this.options.length === 0) {
        // eslint-disable-next-line
        this.options = [...arr];
      } else {
        this.appendChildren(arr, code, this.options);
      }
    },
    appendChildren(arr, code, loopArr) {
      console.log('loopArr>>>', loopArr);
      console.log('code>>>', code);
      console.log('arr>>>', arr);
      for (let i = 0; i < loopArr.length; i += 1) {
        const e = loopArr[i];
        if (Object.keys(e).includes('children')) {
          this.appendChildren(arr, code, e.children);
          break;
        }
        if (e[this.column.value] === code) {
          console.log('code>>in>>>', code);
          console.log('i>>in>>>', i);
          this.$set(e, 'children', arr);
          // eslint-disable-next-line
          loopArr[i] = e;
          console.log(this.options, this.options[i], loopArr[i]);
          break;
        }
      }
    },
    loadOption(node, resolve) {
      if (!node.root) {
        console.log('node>>', node);
        console.log('getValue>>', node.getValue());
      }
      this.service({
        [this.searchColumn]: node.data ? node.data.provinceCode : '',
      }).then(res => {
        if (res.code === API_CODE_OK) {
          console.log(res,node.level,'---');
          resolve(res.data);
          // if (this.selectValue < this.catchValue) {
          //   this.selectValue.push(this.catchValue[1]);
          //   // node.broadcast(this.loadOption);
          // }
        }
      });
    },
    resetData(value) {
      this.selectValue = [...value];
      if (this.edit) {
        this.service({
          [this.searchColumn]: this.selectValue,
        }).then(res => {
          if (res.code === API_CODE_OK) {
            console.log(res);
            this.options = res.data;
          }
        });
      }
    },
  },
};
</script>
