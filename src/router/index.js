import { createRouter, createWebHashHistory } from "vue-router";
// 引入子路由
import layoutRouter from "./layout.router"
import fullScreen from "./fullScreen.router"

import Layout from '@/views/layout/index.vue'
import ScreenLayout from '@/views/layout/screenLayout.vue'

// 固定路由
export const constantRoutes = [
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
    component: Layout,
    children: [...layoutRouter]
  },
  {
    path: '/screen',
    name: 'screen',
    meta: {
      title: '大屏'
    },
    component: ScreenLayout,
    children: [...fullScreen]
  },
]
// 异步动态路由
export const asyncRoutes = [
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    redirect: '/permission/adminTest',
    meta: {
      title: '权限动态路由',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '/adminTest',
        name: 'adminTest',
        component: () => import('@/views/permissionPage/adminTest.vue'),
        meta: {
          title: 'admin测试页',
          roles: ['admin']
        }
      },
      {
        path: '/editorTest',
        name: 'editorTest',
        component: () => import('@/views/permissionPage/editorTest.vue'),
        meta: {
          title: 'editor测试页',
          roles: ['editor']
        }
      },
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

// 重置路由
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
  })
  router.matcher = newRouter.matcher
}

export default router