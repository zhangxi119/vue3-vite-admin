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
    path: '/index',
    name: 'index',
    meta: {
      title: 'JS示例'
    },
    component: () => import('@/views/layout/index.vue'),
    children: [...layoutRouter]
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
  ...fullScreen
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