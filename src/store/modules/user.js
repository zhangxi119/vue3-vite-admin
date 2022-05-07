import { login, getInfo } from '@/api/index.js'
import { getToken, setToken } from '@/utils/auth.js'
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
        resolve()
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

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}