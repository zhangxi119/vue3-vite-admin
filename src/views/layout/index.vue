

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
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="item in breadList" :key="item.path" :to="{ path: item.path}">{{item.meta.title}}</el-breadcrumb-item>
            </el-breadcrumb>
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
  import { defineComponent, reactive, ref, toRefs, watch, onMounted } from 'vue'
  import { ArrowRight } from '@element-plus/icons-vue'
  import sliderMenu from './sliderMenu.vue'
  import { useRouter, useRoute } from 'vue-router' 
  import headerCom from './header.vue'
  export default defineComponent({
    props: {
      msg: String
    },
    components: { sliderMenu, headerCom },
    setup(props) {
      const router = useRouter()
      let menuList = reactive([])
      menuList = router.options.routes
      const route = useRoute()
      const state = reactive({
        breadList: []
      })
      onMounted(() => {
        console.log(menuList, '------menuList')
        console.log(route.path, '--------')
        state.breadList = route.matched
      })
      watch(() => route.matched, (newVal, oldVal) => {
        state.breadList = newVal
        console.log(state)
      })
      const menuSelect = (index, indexPath) => {
        console.log(index, '----------index')
      }
      return {
        ArrowRight,
        menuList,
        menuSelect,
        ...toRefs(state)
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
      height: 50px;
      display: flex;
      align-items: center;
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
