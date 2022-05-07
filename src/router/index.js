import { createRouter, createWebHashHistory } from "vue-router";
// 引入子路由
import layoutRouter from "./layout.router"
import fullScreen from "./fullScreen.router"

import Layout from '@/views/layout/index.vue'
import ScreenLayout from '@/views/layout/screenLayout.vue'

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
export const asyncRoutes = [
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '/page',
        name: 'PermissionPage',
        component: () => import('@/views/login/login.vue'),
        meta: {
          title: 'PermissionPage',
          roles: ['admin']
        }
      },
      {
        path: '/page',
        name: 'PermissionPage',
        component: () => import('@/views/login/login.vue'),
        meta: {
          title: 'PermissionPage',
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

export default router