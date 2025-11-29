import axios from 'axios'
import { getToken } from './composables/auth'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(['message'])

// 统一的后端响应格式
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  code?: number
}

// 创建Axios实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 7000,
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    const token = getToken()
    console.log('统一添加请求头中的 Token:' + token)
    // 当 token 不为空时
    if (token) {
      // 添加请求头, key 为 Authorization，value 值的前缀为 'Bearer '
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 若后台有错误提示就用提示文字，默认提示为 '请求失败'
    const errorMsg = error.response.data.message || '请求失败'
    // 弹错误提示
    message.error(errorMsg)
    return Promise.reject(error)
  },
)

export default instance
