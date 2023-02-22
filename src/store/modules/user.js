import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken,setName,setUserId,removeUserId,removeName } from '@/utils/auth'
import router, { resetRouter } from '@/router/index'

const state = {
  token: getToken(),
  userId: '',
  name: '',
  avatar: '',
  introduction: '',
  companiesInfo: '', //供应商信息
  customerInfo: '',  //顾客信息
  chemicalsInfo: null,//化学品信息
  productsInfo: null,//商品信息
  employeesInfo: '',//员工信息
  contactsInfo: '',//公司联系人信息
  accountsInfo: '',//收付款账户信息
  attachmentId: '',//附件iD
  attachment: '',//附件
  attachmentCOA: '',//COA附件
  attachmentMSDS: '',//MSDS附件
  attachmentTestReport: '',//test report附件附件
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ATTACHMENT_Id: (state, data) => {
    state.attachmentId = data
  },
  SET_ATTACHMENT: (state, data) => {
    state.attachment = data
  },
  SET_ATTACHMENT_COA: (state, data) => {
    state.attachmentCOA = data
  },
  SET_ATTACHMENT_MSDS: (state, data) => {
    state.attachmentMSDS = data
  },
  SET_ATTACHMENT_TEST_REPORT: (state, data) => {
    state.attachmentTestReport = data
  },
  SET_CUSTOMER_INFO: (state, data) => {
    state.customerInfo = data
  },
  SET_CHEMICALS_INFO: (state, data) => {
    // state.chemicalsInfo.push(data)
    state.chemicalsInfo = data
  },
  SET_PRODUCTS_INFO: (state, data) => {
    // state.chemicalsInfo.push(data)
    state.productsInfo = data
  },
  SET_COMPANIES_INFO: (state, data) => {
    state.companiesInfo = data
  },
  SET_EMPLOYEES_INFO: (state, data) => {
    state.employeesInfo = data
  },
  SET_CONTACTS_INFO: (state, data) => {
    state.contactsInfo = data
  },
  SET_ACCOUNTS_INFO: (state, data) => {
    state.accountsInfo = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.api_token)
        commit('SET_NAME', data.name)
        commit('SET_USERID', data.id)
        setToken(data.api_token)
        setUserId(data.id)
        setName(data.name)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      const { data } = { 'code': 20000, 'data': { 'roles': ['admin'], 'introduction': 'I am a super administrator', 'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', 'name': 'Super Admin' }}
      if (!data) {
        reject('Verification failed, please Login again.')
      }
      const { roles, name, avatar, introduction } = data
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }

      commit('SET_ROLES', roles)
      // commit('SET_NAME', name)
      // commit('SET_AVATAR', avatar)
      // commit('SET_INTRODUCTION', introduction)
      resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        removeName()
        removeUserId()
        //重载，避免菜单重复。
        location.reload()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')
      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
