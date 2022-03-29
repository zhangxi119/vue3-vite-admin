<template>
  <div>
    <div v-for="(item, index) in tree" :key="index">
      <!-- hidden=true且该路由又有子路由时 直接递归进入子路由 -->
      <div v-if="item.hidden && item.children">
        <SideItem :tree="item.children"></SideItem>
      </div>
      <div v-if="!item.hidden">
        <el-sub-menu :index="item.path" v-if="item.children">
          <template #title>
            <i :class="item.meta.icon || ''"></i>
            <span>{{ item.meta.title }}</span>
          </template>
          <SideItem :tree="item.children"></SideItem>
        </el-sub-menu>

        <el-menu-item :index="item.path" v-if="!item.children">
          <i :class="item.meta.icon || ''"></i>
          <template #title>
            <span>
              {{ item.meta.title }}
            </span>
          </template>
        </el-menu-item>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SideItem",
  props: {
    tree: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>