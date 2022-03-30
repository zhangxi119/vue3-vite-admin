<template>
  <el-select v-model="modelValue" @change="changeSelect">
    <el-option
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    >
    </el-option>
  </el-select>
</template>

<script setup>
  import { ref, computed, defineProps, defineEmits, useAttrs, watch } from 'vue'
  const props = defineProps({
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
  })
  const emits = defineEmits(['update:selectValue'])
  const modelValue = computed({
    get: () => {
      return props.selectValue;
    },
    set: v => {
      // this.$emit('change', v);
      console.log(v, '--------------modelValue')
      emits('update:selectValue', v)
    },
  })
  const attrs = useAttrs()
  const options = computed(() => {
    return attrs.options
  })
  const valuea = ref('')
  const changeSelect = val => {
    console.log(val)
    console.log(valuea, '---------value')
  }
// export default {
//   name: 'CommonSelect',
//   inheritAttrs: false,
//   model: {
//     prop: 'selectValue',
//     event: 'change',
//   },
//   props: {
//     selectValue: {
//       type: [String, Number],
//       default: '',
//     },
//     valueKey: {
//       type: String,
//       default: 'value',
//     },
//     labelKey: {
//       type: String,
//       default: 'label',
//     },
//     clearable: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   computed: {
//     modelValue: {
//       get() {
//         return this.selectValue;
//       },
//       set(v) {
//         this.$emit('change', v);
//       },
//     },
//     options() {
//       return this.$attrs.options;
//     },
//   },
// };
</script>

<style></style>
