import { asyncRoutes, constantRoutes } from '@/router'
import { getAuthMenu } from '@/api/user'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    const menu = {
      path: item.path,
      component: item.component ? (resolve) => require([`@/views${item.component}`], resolve) : Layout,
      children: [],
      name: item.name,
      meta: { title: item.name + '', icon: item.meta.icon || '', roles: item.role || ['admin'] }
    }
    item.hidden ? menu['hidden'] = item.hidden : null
    item.redirect ? menu['redirect'] = item.redirect : null;
    (item.meta && item.meta.noCache) ? menu.meta['noCache'] = item.meta.noCache: null
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            const loadAsyncMeun = []
            getAuthMenu(state.token).then(response => {
                // if (response.code === 0) {
                //   this.$message({
                //     message: '菜单数据加载异常',
                //     type: 0
                //   })
                // } else {
                const asyncMeuns = response.data.page_datas || []
                Object.assign(loadAsyncMeun, asyncMeuns)
                generaMenu(asyncRoutes, loadAsyncMeun)
                    // 先查询后台并返回左侧菜单数据并把数据添加到路由
                let accessedRoutes
                if (roles.includes('admin')) {
                    accessedRoutes = asyncRoutes || []
                } else {
                    accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                }
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)
                    // }
            }).catch(error => {
                console.log(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}