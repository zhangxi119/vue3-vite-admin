<template>
  <div class="breadcrumb-box">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="item in state.breadList" :key="item.path" :to="{ path: item.path}">{{generateTitle(item.meta.title)}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup>
import { defineProps, reactive, watch, onMounted, toRefs } from 'vue'
import { useRoute } from 'vue-router' 
import { ArrowRight } from '@element-plus/icons-vue'
import { generateTitle } from '@/i18n'

const route = useRoute() 
const state = reactive({
  breadList: []
})

// 判断是否为首页
const isDashboard = route => {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}

// 获取处理过的路由列表
const getBreadcrumb = () => {

  let matched = route.matched.filter(item => item.meta && item.meta.title)

  if (!isDashboard(matched[0])) {
    matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
  }

  state.breadList = matched.filter(item => item.meta && item.meta.title)
}

watch(() => route.matched, val => {
  getBreadcrumb()
}, { immediate: true, deep: true })

onMounted(() => {
  getBreadcrumb()
})

</script>

<style lang="scss" scoped>
.breadcrumb-box {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>