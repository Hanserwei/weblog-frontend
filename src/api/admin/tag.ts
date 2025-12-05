import axios, { type ApiResponse, type PageResponse } from '@/axios'
import type { BasePageQuery } from './category'

export interface FindTagPageListReqVO extends BasePageQuery {
  name: string
  startDate: string | null
  endDate: string | null
}

export interface FindTagPageListRspVO {
  id: number
  name: string
  createTime: string
}

interface AddTagReqVO {
  tags: string[]
}

interface DeleteTagReqVO {
  id: number
}

// 获取分类分页数据
export function getTagPageList(data: FindTagPageListReqVO) {
  return axios.post<unknown, PageResponse<FindTagPageListRspVO>>('/admin/tag/list', data)
}

// 添加分类
export function addTag(data: AddTagReqVO) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/tag/add', data)
}

// 删除分类
export function deleteTag(id: DeleteTagReqVO) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/tag/delete', id)
}
