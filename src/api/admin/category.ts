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

export interface AddCategoryReq {
  name: string
}

export interface DeleteCategoryReqVO {
  id: number
}

export interface SelectCategoryRspVO {
  /**
   * Select 下拉列表的展示文字
   */
  label?: string
  /**
   * Select 下拉列表的 value 值，如 ID 等
   */
  value?: number
}

export interface FindCategoryByIdRspVO {
  /**
   * 分类 ID
   */
  id?: number
  /**
   * 分类名称
   */
  name?: string
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

// 分类 Select 下拉列表数据获取
export function findCategorySelectList() {
  return axios.post<unknown, ApiResponse<SelectCategoryRspVO[]>>('/admin/category/select/list')
}

// 根据ID查询分类信息
export function findCategoryById(id: number) {
  return axios.get<unknown, ApiResponse<FindCategoryByIdRspVO>>(`/admin/category/find/${id}`)
}
