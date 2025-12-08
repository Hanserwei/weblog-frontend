import axios, { type ApiResponse } from '@/axios'

export interface FindCategoryListRspVO {
  /**
   * 分类id
   */
  id?: number
  /**
   * 分类名称
   */
  name?: string
}

export function findCategoryList() {
  return axios.post<unknown, ApiResponse<FindCategoryListRspVO[]>>('/category/list')
}
