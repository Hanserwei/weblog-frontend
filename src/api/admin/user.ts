import axios, { type ApiResponse } from '@/axios'

export interface LoginResponse {
  token: string
}

export interface FindUserInfoResponse {
  username: string
}

export interface UpdateAdminUserPasswordRequest {
  username: string
  password: string
  rePassword: string
}

export function login(username: string, password: string) {
  // <unknown, ApiResponse<LoginResponse>>
  // 第一个 unknown: 我们不关心 Axios 默认推断的 T，因为我们要重写 R
  // 第二个 ApiResponse<LoginResponse>: 我们明确告诉 TS，这个 Promise 解析出来的是 ApiResponse
  return axios.post<unknown, ApiResponse<LoginResponse>>('/login', {
    username,
    password,
  })
}

// 获取登录用户信息
export function getUserInfo() {
  // 同理，使用 unknown 占位
  return axios.post<unknown, ApiResponse<FindUserInfoResponse>>('/admin/user/info')
}

// 修改用户密码
export function updateAdminPassword(data: UpdateAdminUserPasswordRequest) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/password/update', data)
}
