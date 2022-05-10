<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadList" :key="item.path" :to="{ path: item.path}">{{item.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
import { defineProps, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router' 
import { ArrowRight } from '@element-plus/icons-vue'

// defineProps({
//   breadList: {
//     type: Array,
//     default: []
//   }
// })
const route = useRoute() 
let breadList = reactive([])
watch(() => route.matched, val => {
  breadList = val
}, { immediate: true, deep: true })
onMounted(() => {
  // breadList = route.matched
})

</script>