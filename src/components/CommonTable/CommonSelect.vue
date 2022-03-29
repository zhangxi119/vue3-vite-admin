<template>
  <el-select v-model="modelValue" v-bind="$attrs" :clearable="clearable">
    <el-option
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'CommonSelect',
  inheritAttrs: false,
  model: {
    prop: 'selectValue',
    event: 'change',
  },
  props: {
    selectValue: {
      type: [String, Number],
      default: '',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    modelValue: {
      get() {
        return this.selectValue;
      },
      set(v) {
        this.$emit('change', v);
      },
    },
    options() {
      return this.$attrs.options;
    },
  },
};
</script>

<style></style>
