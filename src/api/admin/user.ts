import axios, { type ApiResponse } from '@/axios'

export interface LoginResponse {
  token: string
}

export function login(username: string, password: string) {
  return axios.post<ApiResponse<LoginResponse>>('/login', {
    username,
    password,
  })
}
