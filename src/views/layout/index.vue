

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <headerCom></headerCom>
      </el-header>
      <el-container class="el-container">
        <el-aside width="200px">
          <!-- default-active="/debounceTest" -->
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            @select="menuSelect"
          >
            <!-- <SideItem :tree="routes"> </SideItem> -->
            <sliderMenu :tree="menuList"></sliderMenu>
          </el-menu>
        </el-aside>
        <el-main class="el-main">
          <div class="breadcrumb">
            <Breadcrumb />
            <TagsView />
          </div>
          <div class="main-container">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" v-if="$route.meta.keepAlive"></component>
              </keep-alive>
              <component :is="Component" v-if="!$route.meta.keepAlive"></component>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import { defineComponent, computed } from 'vue'
  import { useStore } from 'vuex'
  import { ArrowRight } from '@element-plus/icons-vue'
  import sliderMenu from './sliderMenu.vue'
  import headerCom from './header.vue'
  import Breadcrumb from './components/Breadcrumb.vue'
  import TagsView from './components/TagsView/index.vue'
  export default defineComponent({
    props: {
      msg: String
    },
    components: { sliderMenu, headerCom, Breadcrumb, TagsView },
    setup(props) {
      const store = useStore()
      // 获取动态路由
      const menuList = computed(() => store.getters.permission_routes)
      const menuSelect = (index, indexPath) => {
      }
      return {
        ArrowRight,
        menuList,
        menuSelect,
      }
    }
  })
</script>
<style lang="scss">
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
  .el-header {
    padding: 0;
  }
  .el-container {
    // background: #e5e9f2;
  }
  .el-main {
    background: #ffffff;
    padding: 0 20px 20px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .breadcrumb {
      // height: 50px;
      display: flex;
      flex-direction: column;
      // align-items: center;
    }
    .main-container {
      flex: 1;
      background: #e5e9f2;
    }
  }
  .el-menu-vertical-demo {
    height: 100%;
  }
}
</style>
