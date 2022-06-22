import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: '大屏示例'
    },
    component: () => import(/* webpackChunkName: "screen" */ '@/views/screen/index.vue'),
  },
]

export default routes