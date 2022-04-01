export default [
  {
    path: '/debounceTest',
    name: 'debounceTest',
    meta: {
      title: '防抖',
      keepAlive: true,
    },
    component: () => import('@/components/jsDemo/debounceTest.vue'),
  },
  {
    path: '/throttleTest',
    name: 'throttleTest',
    meta: {
      title: '节流'
    },
    component: () => import('@/components/jsDemo/throttleTest.vue'),
  },
  {
    path: '/deepClone',
    name: 'deepClone',
    meta: {
      title: '克隆'
    },
    component: () => import('@/components/jsDemo/deepClone.vue'),
  },
  {
    path: '/checkTask',
    name: 'checkTask',
    meta: {
      title: 'table组件'
    },
    component: () => import('@/views/checkTask/index.vue'),
  },
]