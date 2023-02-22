import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
* 注意：子菜单仅在路由 children.length >= 1 时出现
 * 详情见：https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true 如果设置为 true，则项目不会显示在侧边栏中（默认为 false）
 *redirect: 'noRedirect'当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * alwaysShow: true 如果设置为true，将始终显示根菜单
 * 如果不设置 alwaysShow，当 item 有多个子路由时，
 * 会变成嵌套模式，否则不显示根菜单
 * 重定向：noRedirect 如果设置 noRedirect 将不会在面包屑中重定向
 * name:'router-name' <keep-alive> 使用的名称（必须设置！！！）
 *meta：{
    roles：['admin','editor'] 控制页面角色（可以设置多个角色）
    title: 'title' 侧边栏和面包屑中显示的名称（推荐设置）
    icon: 'svg-name' 图标显示在侧边栏中
    noCache: true 如果设置为true，页面将不被缓存（默认为false）
    affix：true 如果设置为 true，则标签将附加在标签视图中
    breadcrumb：假如果设置为假，项目将隐藏在面包屑中（默认为真）
    activeMenu: '/example/list' 如果设置路径，侧边栏会高亮你设置的路径
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: '首页',
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }, {
      path: '/inquiry/detailed',
      component: () => import('@/views/inquiry/detailed'),
      hidden: true
    }, {
      path: '/inquiry/inquiry_quotations_detailed',
      component: () => import('@/views/inquiry/inquiry_quotations_detailed'),
      hidden: true
    }, {
      path: '/chem/products_detailed',
      // name:'产品详情',
      component: () => import('@/views/chem/products_detailed'),
      hidden: true
    }
    ]
  }
]

/**
 * 异步路由
 * 需要根据用户角色动态加载的路由
 */
// export const asyncRoutes = [
//   componentsRouter,
//   chartsRouter,
//   nestedRouter,
//   tableRouter
// ]
export const asyncRoutes = []

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
