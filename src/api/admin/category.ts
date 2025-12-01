import axios, { type ApiResponse, type PageResponse } from '@/axios'

export interface BasePageQuery {
  current: number
  size: number
}

export interface FindCategoryPageListReqVO extends BasePageQuery {
  name: string
  startDate: string | null
  endDate: string | null
}

export interface FindCategoryPageListRspVO {
  id: number
  name: string
  createTime: string
}

interface AddCategoryReq {
  name: string
}

interface DeleteCategoryReqVO {
  id: number
}

// 获取分类分页数据
export function getCategoryPageList(data: FindCategoryPageListReqVO) {
  return axios.post<unknown, PageResponse<FindCategoryPageListRspVO>>('/admin/category/list', data)
}

// 添加分类
export function addCategory(data: AddCategoryReq) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/category/add', data)
}

// 删除分类
export function deleteCategory(id: DeleteCategoryReqVO) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/category/delete', id)
}
