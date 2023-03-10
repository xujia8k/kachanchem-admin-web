import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/api/admin/v1', // 网址=基本网址+请求网址
  // baseURL: '/api/admin/v1', // 网址=基本网址+请求网址
  // withCredentials: true, // 跨域请求时发送cookie
  timeout: 100000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 发送请求前需要处理的业务
    if (store.getters.token) {
      // 让每个请求都携带令牌
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // 发送请求错误的操作
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   *如果您想获取诸如标题或状态之类的http信息
   *请返回响应=>响应
   */

  /**
   *通过自定义代码确定请求状态
   *这只是一个例子
   *您也可以通过HTTP状态代码来判断状态
   */
  response => {
    const res = response.data
    // 如果自定义代码不是0，则将其判断为错误。这里只是一个例子，真是项目应该以前后端协商结果标识为准
    if (res.code !== 0) {
      Message({
        message: res.message || '操作失败！',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008：非法令牌； 50012：其他客户端登录； 50014：令牌已过期；
      if (res.code === 10001 || res.code === 10002 || res.code === 10003 || res.code === 10004) {
        // to re-login
        MessageBox.confirm('当前账号异常，请重新登录', '确认退出', {
          confirmButtonText: '再次登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // 没有权限访问此页面
      if (res.code === 40001) {
        MessageBox.confirm(res.message, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
        })
      }
      return Promise.reject(new Error(res.message || '操作失败！'))
    } else {
      return res
    }

    return res
  },
  error => {
    console.log('err' + error) // for debug
    if (error && error.request) {
      const status = error.request['status']
      switch (status) {
        case 401:
          Message({ message: '接口配置未经授权！', type: 'error', duration: 3000 })
          break
        case 404:
          Message({ message: '服务端接口未找到！', type: 'error', duration: 3000 })
          break
        case 415:
          Message({ message: 'HTTP协议不匹配，请确认！', type: 'error', duration: 3000 })
          break
        case 500:
          Message({ message: '服务器未启动！', type: 'error', duration: 3000 })
          break
        default:
          Message({ message: '未知错误！', type: 'error', duration: 3000 })
          break
      }
    } else {
      Message({
        message: error.message || '服务错误！',
        type: 'error',
        duration: 3000
      })
    }

    return Promise.reject(error)
  }
)

export default service
