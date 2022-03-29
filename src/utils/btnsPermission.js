import Vue from "vue";
import store from "../store";
import router from "../router";
import {getFeatureForCode} from "../api/permission";

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.code) {
    try {
      const {result} = await getFeatureForCode({code: to.meta.code})
      store.commit('app/SET_CURRENT_ROUTE_BTNS', result || [])
      next()
    } catch (e) {
      next()
    }
  } else {
    store.commit('app/SET_CURRENT_ROUTE_BTNS', [])
    next()
  }
});

// 这个指令的目的是为了根据接口返回的按钮权限来显示隐藏按钮
Vue.directive('btn-permission', {
  inserted(el, bingding, vnode) {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if( process.env.NODE_ENV === 'development' || userInfo.username === 'ADMIN'){
      return
    }
    const currentEleBtnName = bingding.value
    const isArray = Array.isArray(currentEleBtnName)
    const storeBtns = store.getters.currentRouteBtns
    const userOrgType = userInfo.userOrgType
    if (!isArray) {
      // eslint-disable-next-line no-shadow
      const findValue = storeBtns.find(el => el.featureName === currentEleBtnName)
      // console.log(findValue, 'findValuefindValuefindValue1111111');
      if (!findValue) {
        el.parentElement.removeChild(el)
      } else {
        // 这里根据当前登录人的机构来做相应判断
        // eslint-disable-next-line no-lonely-if
        if (!findValue.featureOrgList.includes(userOrgType)) {
          el.parentElement.removeChild(el)
        }
      }
    } else {
      const [name, func] = currentEleBtnName
      // eslint-disable-next-line no-shadow
      const findValue = storeBtns.find(el => el.featureName === name)
      // console.log(findValue,findValue.featureOrgList,userOrgType,findValue.featureOrgList.includes(userOrgType), 'findValuefindValuefindValue2222222');
      const muFunc = () => {
        const child = el.parentElement.childNodes
        const nodeChild = Array.from(child).filter(el => el.nodeType === 1)
        // console.log(nodeChild, 'child')
        el.parentElement.removeChild(el)
        if (!(nodeChild.length - 1)) {
          func.call(vnode.context)
        }
      }
      if (!findValue) {
        muFunc()
      } else if (!findValue.featureOrgList.includes(userOrgType)) {
        muFunc()
      }
    }
  }
})
