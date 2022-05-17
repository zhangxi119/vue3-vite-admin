<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag,$event)"
      >
        {{ generateTitle(tag.title) }}
        <el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </scroll-pane>
    <ul v-show="state.visible" :style="{left:state.left+'px',top:state.top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(state.selectedTag)">{{ $t('tagsView.refresh') }}</li>
      <li v-if="!isAffix(state.selectedTag)" @click="closeSelectedTag(state.selectedTag)">{{ $t('tagsView.close') }}</li>
      <li @click="closeOthersTags(state.selectedTag)">{{ $t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags(state.selectedTag)">{{ $t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>
<script setup>
import ScrollPane from './ScrollPane.vue'
import { generateTitle } from '@/i18n'
import path from 'path-browserify'
import { Close } from '@element-plus/icons-vue'
import { ref, toRefs, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const state = reactive({
  visible: false,
  left: 0,
  top: 0,
  selectedTag: {},
  affixTags: [],
})

// 获取所有已被允许的标签
const routes = computed(() => store.getters.permission_routes)
const visitedViews = computed(() => store.getters.visitedViews)

// 过滤出固定的标签
function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length > 0) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
// 是否为固定标签
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}
// 初始化标签
function initTags() {
  const affixTags = state.affixTags = filterAffixTags(routes.value)
  for(const tag of affixTags) {
    if (tag.name) {
      store.dispatch('tagsView/addVisitedView', tag)
    }
  }
}
// 新增标签
function addTags() {
  const { name } = route
  if (name) {
    store.dispatch('tagsView/addView', route)
  }
}
function isActive(tag) {
  return tag.path === route.path
}
// 关闭标签
function closeSelectedTag(view) {
  store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
    // 判断是否为当前标签
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
function toLastView(visitedViews, view) {
  const lastView = visitedViews.slice(-1)[0]
  if (lastView) {
    router.push(lastView.fullPath)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
// 滚动
function handleScroll() {
  
}
// 打开右键自定义菜单
function openMenu(tag, e) {
  console.log(tag, '-------------tab');
  console.log(e, '----------e');
  state.left = e.clientX + 15
  state.top = e.clientY
  state.selectedTag = tag
  state.visible = true
}
// 兼容滚动条的移动到目标标签
function moveToCurrentTag() {
  // const tags = this.$refs.tag
  // this.$nextTick(() => {
  //   for (const tag of tags) {
  //     if (tag.to.path === this.$route.path) {
  //       this.$refs.scrollPane.moveToTarget(tag)
  //       // when query is different then update
  //       if (tag.to.fullPath !== this.$route.fullPath) {
  //         this.$store.dispatch('tagsView/updateVisitedView', this.$route)
  //       }
  //       break
  //     }
  //   }
  // })
}
// 
function refreshSelectedTag(view) {
  store.dispatch('tagsView/delCachedView', view).then(() => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({
        path: fullPath
      })
    })
  })
}
// 关闭所有标签
function closeAllTags(view) {
  store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
    if (state.affixTags.some(tag => tag.path === view.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}
// 关闭其它标签
function closeOthersTags(view) {
  router.push(view)
  store.dispatch('tagsView/delOthersViews', view).then(() => {
    moveToCurrentTag()
  })
}
// 关闭右键菜单
function closeMenu() {
  state.visible = false
}

// 监听路由变化
watch(route, val => {
  addTags()
}, {deep: true})
watch(() => state.visible, val => {
  if (val) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

// 挂载
onMounted(() => {
  initTags()
  addTags()
})

</script>


<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: -1px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>