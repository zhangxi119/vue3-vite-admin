<template>
  <div>
    <div v-for="(item, index) in tree" :key="index">
      <!-- hidden=true且该路由又有子路由时 直接递归进入子路由 -->
      <div v-if="item.hidden && item.children">
        <sliderMenu :tree="item.children"></sliderMenu>
      </div>
      <div v-if="!item.hidden">
        <el-sub-menu :index="item.path" v-if="item.children">
          <template #title>
            <i :class="item?.meta?.icon || ''"></i>
            <span>{{ generateTitle(item?.meta?.title) }}</span>
          </template>
          <sliderMenu :tree="item.children"></sliderMenu>
        </el-sub-menu>

        <el-menu-item :index="item.path" v-if="!item.children">
          <i :class="item?.meta.icon || ''"></i>
          <template #title>
            <span>
              {{ generateTitle(item?.meta?.title) }}
            </span>
          </template>
        </el-menu-item>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import { generateTitle } from '@/i18n'
defineProps({
  tree: {
    type: Array,
  }
})
</script>
<style lang="scss" scoped>
</style>