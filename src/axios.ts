import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { getToken } from './composables/auth'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(['message'])

// 1. 定义并导出泛型接口，默认 T 为 unknown 而不是 any
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  code?: number
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 7000,
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  // 响应拦截器
  (response: AxiosResponse<ApiResponse>) => {
    // 2. 这里的返回值其实是 ApiResponse，但 Axios 类型定义要求返回 AxiosResponse
    // 所以我们用 'as unknown as AxiosResponse' 来通过 TS 检查，同时保持运行时逻辑不变
    return response.data as unknown as AxiosResponse
  },
  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    // error 类型通常比较复杂，如果是严格模式，可以使用 any 或者处理 error 为 unknown
    // 这里为了获取 error.response，通常不得不保留 any，或者使用断言
    const errorMsg = (error.response?.data as ApiResponse)?.message || '请求失败'
    message.error(errorMsg)
    return Promise.reject(error)
  },
)

export default instance
