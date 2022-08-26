import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import type { RouteRecordRaw, Router } from "vue-router"
// 引入子路由
import layoutRouter from "./layout.router"
import fullScreen from "./fullScreen.router"

import Layout from '@/views/layout/index.vue'
import ScreenLayout from '@/views/layout/screenLayout.vue'

// 固定路由
export const constantRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   redirect: '/index',
  //   meta: {},
  //   hidden: true,
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          affix: true,
        },
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'login',
      hidden: true,
    },
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/index',
    name: 'index',
    redirect: '/checkTask',
    meta: {
      title: 'component'
    },
    component: Layout,
    children: [...layoutRouter]
  },
  {
    path: '/screen',
    name: 'screen',
    meta: {
      title: 'screen'
    },
    component: ScreenLayout,
    children: [...fullScreen]
  },
  {
    path: '/guide',
    // redirect: '/guide/index',
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/guide/index',
        name: 'guide',
        meta: {
          title: 'guide'
        },
        component: () => import('@/views/guide/index.vue')
      }
    ]
  },
  {
    path: '/treeEditor',
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/treeEditor',
        name: 'treeEditor',
        meta: {
          title: 'treeEditor'
        },
        component: () => import('@/views/treeEditor/index.vue')
      }
    ]
  },
]
// 异步动态路由
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    redirect: '/permission/adminTest',
    meta: {
      title: 'sportAuthRouter',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '/adminTest',
        name: 'adminTest',
        component: () => import('@/views/permissionPage/adminTest.vue'),
        meta: {
          title: 'adminTest',
          roles: ['admin']
        },
        // children: [
        //   {
        //     path: '/testPath',
        //     name: 'testPath',
        //     component: () => import('@/views/permissionPage/editorTest.vue'),
        //     meta: {
        //       title: '嵌套路由测试',
        //       roles: ['editor']
        //     }
        //   }
        // ]
      },
      {
        path: '/editorTest',
        name: 'editorTest',
        component: () => import('@/views/permissionPage/editorTest.vue'),
        meta: {
          title: 'editorTest',
          roles: ['editor']
        }
      },
    ]
  }
]

// 创建路由实例
const router: Router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

// 递归汇总白名单路由的名称
const WHITE_NAME_LIST: string[] = [];
const getRouteName = (array: any[]) => {
  array.forEach(item => {
    WHITE_NAME_LIST.push(item.name)
    getRouteName(item.children || [])
  })
}
getRouteName(constantRoutes)

// 重置路由
export function resetRouter() {
  // const newRouter = createRouter({
  //   history: createWebHistory(import.meta.env.BASE_URL),
  //   routes: constantRoutes,
  // })
  // router.matcher = newRouter.matcher

  // vue-router4X 版本添加了removeRoute方法
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export default router