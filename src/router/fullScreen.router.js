export default [
  {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: '大屏首页'
    },
    component: () => import('@/views/screen/index.vue'),
  },
]