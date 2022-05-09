import router from './router'
import store from './store'
// 页面进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false })

import { getToken } from '@/utils/auth' // get token from cookie

// 白名单
const whiteList = ['/login', 'auth-redrect']

router.beforeEach(async(to, from, next) => {

  // 开始进度条
  NProgress.start()

  // 获取token
  const hasToken = getToken()

  if (hasToken) {
    // 如果已登录，直接跳到首页
    if (to.path === '/login') {
      next({ path: '/'})
      NProgress.done()
    } else {
      // 未登录，先判断是否缓存路由权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } 
      else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          // 动态添加带有权限标识的路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          accessRoutes.forEach(item => {
            router.addRoute(item)
          })
          next({...to, replace: true})
        } catch(err) {
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }

    }
  } else {
    // 白名单里的路由直接通过
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`login?redirect=${to.path}`)
    }
  }
  // const token = sessionStorage.getItem('token')
  // if( to.meta.notNeedLogin || to.name == 'login' || token ) {
  //   next()
  //   NProgress.done()
  // } else {
  //   next({name: 'login'})
  //   NProgress.done()
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
