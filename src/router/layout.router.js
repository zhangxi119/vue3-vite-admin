export default [
  {
    path: '/checkTask',
    name: 'checkTask',
    meta: {
      title: 'table组件'
    },
    component: () => import('@/views/checkTask/index.vue'),
  },
]