/*
 * @Author: zhangxi 380313641@qq.com
 * @Date: 2022-03-29 10:12:05
 * @LastEditors: zhangxi
 * @LastEditTime: 2022-08-26 17:18:50
 * @FilePath: \vue3-vite-admin\src\router\fullScreen.router.ts
 * @Description: 
 */
import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: 'bigScreen'
    },
    component: () => import(/* webpackChunkName: "screen" */ '@/views/screen/index.vue'),
  },
]

export default routes