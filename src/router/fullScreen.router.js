export default [
  {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: '大屏示例'
    },
    component: () => import('@/views/screen/index.vue'),
  },
]