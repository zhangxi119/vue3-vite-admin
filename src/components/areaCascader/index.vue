<template>
  <el-cascader
    ref="cascader"
    v-model="selectOptions"
    :options="options"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :props="dataProps"
    popper-class="area-cascader-pop"
    @expand-change="handleItemChange"
    @change="handleItemChange"
    @focus="handleFocus"
  >
  </el-cascader>
</template>

<script>
export default {
  name: 'AreaCascader',
  props: {
    // 是否支持清空选项
    clearable: {
      type: Boolean,
      default: true,
    },
    // 输入框占位文本
    placeholder: {
      type: String,
      default: '请选择',
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否允许选择任意一级的选项
    changeOnSelect: {
      type: Boolean,
      default: false,
    },
    // 层级 默认为3 有些需要到镇
    depth: {
      type: Number,
      default: 3,
    },
    // 选中项绑定值
    value: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    // 配置选项显示的key和value字段映射
    column: {
      type: Object,
      default() {
        return {
          value: 'provinceCode',
          label: 'provinceName',
        };
      },
    },
    searchColumn: {
      type: String,
      default: 'parentCode',
    },
    // 搜索方法
    service: {
      type: Function,
      required: true,
    },
    cache: {
      type: Boolean,
      default: true,
    },
    readySearch: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    // const that = this;
    return {
      isFirstShow: true, // 是否第一次展开
      cachedChildOption: {}, // 缓存的子选项列表
      options: [], // 用于显示级联数据
      initValue: [], // 用于初始化有值的数据（编辑时候）
      selectOptions: [], // 已经选择的数据，用于和v-model联动
      title: '',
      dataProps: {
        // value: that.column.value,
        // label: that.column.label,
        checkStrictly: false,
        expandTrigger: 'hover',
      },
      catchKeys: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.selectOptions = v;
      },
    },
    selectOptions: {
      deep: true,
      immediate: true,
      handler(v) {
        this.$emit('input', v);
      },
    }
  },
  mounted() {
    // if (this.readySearch) {
      this.initPage();
    // }
  },
  methods: {
    // 值改变事件
    async emitChange() {

      // 回调change事件
      this.$emit('change', this.selectOptions);
      await this.$nextTick();
      // // 设置标题
      // this.setTitle();
      // 将选择得到的value值和title做合并，回调change-full-data事件
      // const titleArr = this.title.split(' / ');
      // const fullData = this.selectOptions.map((v, i) => ({
      //   value: v,
      //   label: titleArr[i] || '',
      // }));
      // this.$emit('change-full-data', fullData);
    },
    // 项目点击事件
    async handleItemChange(ids) {
      const { length } = ids;
      this.selectOptions = [...ids];
      if (length && length < this.depth) {
        if (!this.isExistChildren(ids, this.options)) {
          await this.getOptionData(ids[length - 1], length);
        }
      }
      this.emitChange();
    },
    // // 设置title信息
    // setTitle() {
    //   if (this.$refs.cascader && this.$refs.cascader.$el) {
    //     this.title = this.$refs.cascader.$el.innerText;
    //   }
    // },
    // 获取选项数据
    async getOptionData(id, curDepth) {
      if (this.catchKeys.includes(id)) {
        return;
      }
      if (id) {
        this.catchKeys.push(id);
      }
      try {
        this.cachedChildOption = {};
        const res = await this.service({
          [this.searchColumn]: id,
        });
        if (this.$root.Utils.checkResult(res)) {
          this.cachedChildOption = await this.formatChildOption(
            res.data,
            curDepth
          );
          if (this.options.length) {
            this.appendChildOption(id, this.options);
          } else {
            this.options = this.cachedChildOption.concat();
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 根据已选择的id来获取城市信息
    async getAreaInfoBySelectIds(ids = []) {
      const cloneIds = [...ids];
      if (ids && ids.length) {
        const id = cloneIds.shift();
        const idx = this.initValue.findIndex(v => v === id) + 1;
        this.selectOptions = this.selectOptions.concat(id);
        if (idx && idx < this.depth) {
          if (
            !this.isExistChildren(this.initValue.slice(0, idx), this.options)
          ) {
            await this.getOptionData(id, idx);
          }
          await this.getAreaInfoBySelectIds(cloneIds);
        }
      }
    },
    // 格式化选项模型
    formatChildOption(data, curDepth) {
      return data.map(v => {
        const curDataModel = {
          value: v[this.column.value],
          label: v[this.column.label],
        };
        if (this.depth > curDepth + 1) {
          curDataModel.children = [];
          curDataModel.service = true;
        }
        return curDataModel;
      });
    },
    // 拼接选项数据
    appendChildOption(id, options) {
      return options.some(v => {
        if (Object.keys(v).includes('children')) {
          if (!v.children.length && v.value === id) {
            // eslint-disable-next-line
            v.children = [...this.cachedChildOption];
            // eslint-disable-next-line
            v.service = false;
            return true;
          }
          return this.appendChildOption(id, v.children);
        }
        return false;
      });
    },
    // 聚焦时候触发
    handleFocus() {
      this.$emit('focus', this.isFirstShow);
      if (this.isFirstShow) {
        this.isFirstShow = false;
      }
    },
    // 初始化页面
    async initPage() {
      console.log("0909087")

      if (this.service) {
        if (!this.cache) {
          this.options = [];
        }
        if (!this.options.length) {
          await this.getOptionData('', 0);
        }
        if (this.selectOptions.length) {
          this.initValue = [...this.selectOptions];
          this.selectOptions = [];
          await this.getAreaInfoBySelectIds(this.initValue);
          this.emitChange();
        }
      }
    },
    // 重置绑定值及选项数据
    resetData(v) {
      this.title = '';
      this.selectOptions = v;
      this.initPage();
    },
    // 判断数据是否已经缓存
    isExistChildren(ids, options) {
      if (!this.cache) {
        return false;
      }
      const cloneIds = [...ids];
      const id = cloneIds.shift();
      if (!options || !options.length || !ids || !ids.length) {
        return false;
      }
      return options.some(v => {
        if (v.value === id) {
          if (cloneIds.length) {
            return this.isExistChildren(cloneIds, v.children);
          }
          return v.children && v.children.length;
        }
        return false;
      });
    },
  },
};
</script>
