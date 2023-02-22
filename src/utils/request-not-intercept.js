import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/api/admin/v1',
    // baseURL: '/api/admin/v1', // 网址=基本网址+请求网址
    // withCredentials: true, // 跨域请求时发送cookie
    timeout: 100000 // request timeout
})

// 不拦截错误信息请求，用于文件上传下载使用。
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
        return response.data
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