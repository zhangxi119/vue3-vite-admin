import { login, getInfo, logout } from '@/api/index.ts'
import { getToken, setToken, removeToken } from '@/utils/auth.js'
import { resetRouter } from '@/router'
const state = {
  userInfo: {},
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}
const mutations = {
  SET_USER_INFO: (state, params) => {
    state.userInfo = params
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}
const actions = {
  ADD_USER_INFO: ({commit}, params) => {
    setTimeout(() => {
      commit('SET_USER_INFO', params)
    },1000)
  },
  // 登录
  login: ({commit}, params) => {
    const { userName, password } = params
    return new Promise((resolve, reject) => {
      login({userName: userName.trim(), password: password}).then(res => {
        const { data } = res
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setTimeout(() => {
          resolve()
        }, 3000);
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 通过token获取用户信息
  getInfo: ({commit, state }) => {
    console.log(state.token, '------token')
    return new Promise((resolve, reject) => {
      getInfo({token: state.token}).then(res => {
        const data = res.data
        console.log(data, '---------data')
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { roles, name, avatar, introduction } = data
        // 无角色信息时
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })

  },
  // 退出登录
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        // dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}