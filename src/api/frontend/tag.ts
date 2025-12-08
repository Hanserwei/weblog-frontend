import axios, { type ApiResponse } from '@/axios'

export interface FindTagListRspVO {
  /**
   * 标签id
   */
  id?: number
  /**
   * 标签名称
   */
  name?: string
}

export function findTagList() {
  return axios.post<unknown, ApiResponse<FindTagListRspVO[]>>('/tag/list')
}
