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

export interface AddTagReqVO {
  tags: string[]
}

export interface DeleteTagReqVO {
  id: number
}

export interface SearchTagReqVO {
  key: string
}

export interface SelectTagRspVO {
  /**
   * Select 下拉列表的展示文字
   */
  label?: string
  /**
   * Select 下拉列表的 value 值，如 ID 等
   */
  value?: number
}

export interface FindTagsByIdsRspVO {
  /**
   * 标签 ID
   */
  id?: number
  /**
   * 标签名称
   */
  name?: string
}

export interface FindTagsByIdsReqVO {
  /**
   * 标签 ID 集合
   */
  tagIds: number[]
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

// 标签模糊查询
export function searchTag(key: SearchTagReqVO) {
  return axios.post<unknown, ApiResponse<SelectTagRspVO[]>>('/admin/tag/search', key)
}

// 根据ID列表查询标签
export function findTagsByIds(data: FindTagsByIdsReqVO) {
  return axios.post<unknown, ApiResponse<FindTagsByIdsRspVO[]>>('/admin/tag/list/ids', data)
}
