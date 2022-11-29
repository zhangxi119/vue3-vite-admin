/*
 * @Author: zhangxi 380313641@qq.com
 * @Date: 2022-03-29 10:12:05
 * @LastEditors: zhangxi
 * @LastEditTime: 2022-11-29 16:16:24
 * @FilePath: \vue3-vite-admin\src\router\layout.router.ts
 * @Description: 
 */

import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/checkTask',
    name: 'checkTask',
    meta: {
      title: 'table组件'
    },
    component: () => import('@/views/checkTask/index.vue'),
  },
  {
    path: '/warterMarker',
    name: 'warterMarker',
    meta: {
      title: '页面水印'
    },
    component: () => import('@/views/warterMarker/index.vue'),
  },
  {
    path: '/marqueeX',
    name: 'marqueeX',
    meta: {
      title: '文字跑马灯'
    },
    component: () => import('@/components/marquee/marqueeX.vue'),
  }
]

export default routes