import { createRouter, createWebHashHistory } from "vue-router";
import layoutRouter from "./layout.router"
import fullScreen from "./fullScreen.router"
import { nextTick } from "vue";
const routes = [
  {
    path: '/',
    redirect: '/index',
    meta: {},
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    hidden: true,
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '组件'
    },
    component: () => import('@/views/layout/index.vue'),
    children: [...layoutRouter]
  },
  {
    path: '/screen',
    name: 'screen',
    meta: {
      title: '大屏'
    },
    component: () => import('@/views/layout/screenLayout.vue'),
    children: [...fullScreen]
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if( to.meta.notNeedLogin || to.name == 'login' || token ) {
    next()
  } else {
    next({name: 'login'})
  }
})
export default router