import { createStore } from 'vuex'

export default createStore({
  state: {
    userInfo: {}
  },
  getters: {
    GET_USER_INFO: state => {
      return state.userInfo
    }
  },
  mutations: {
    SET_USER_INFO: (state, params) => {
      state.userInfo = params
    }
  },
  actions: {
    ADD_USER_INFO: ({commit}, params) => {
      setTimeout(() => {
        commit('SET_USER_INFO', params)
      },1000)
    }
  },
  modules: {

  }

})