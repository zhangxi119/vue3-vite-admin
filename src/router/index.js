import { createRouter, createWebHashHistory } from "vue-router";
import layoutRouter from "./layout.router"
import fullScreen from "./fullScreen.router"
const routes = [
  {
    path: '/',
    redirect: '/index',
    meta: {},
    hidden: true,
  },
  {
    path: '/index',
    name: 'index',
    meta: {
      title: 'JS示例'
    },
    component: () => import('@/views/layout/index.vue'),
    children: [...layoutRouter]
  },
  ...fullScreen
]
console.log(routes)
export default createRouter({
  history: createWebHashHistory(),
  routes,
})