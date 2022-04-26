const state = {
  userInfo: {}
}
 const getters = {
  GET_USER_INFO: state => {
    return state.userInfo
  }
}
const mutations = {
  SET_USER_INFO: (state, params) => {
    state.userInfo = params
  }
}
const actions = {
  ADD_USER_INFO: ({commit}, params) => {
    setTimeout(() => {
      commit('SET_USER_INFO', params)
    },1000)
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
}