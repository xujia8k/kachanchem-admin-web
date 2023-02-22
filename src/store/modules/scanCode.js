// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken,setName,setUserId,removeUserId,removeName } from '@/utils/auth'
// import router, { resetRouter } from '@/router/index'

const state = {
  scanstring: '',
}

const mutations = {
  SET_SCANSTRING: (state, scanstring) => {
    state.scanstring = scanstring
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
