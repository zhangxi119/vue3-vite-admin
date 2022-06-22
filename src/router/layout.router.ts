
import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
    {
    path: '/checkTask',
    name: 'checkTask',
    meta: {
      title: 'table组件'
    },
    component: () => import('@/views/checkTask/index.vue'),
  }
]

export default routes