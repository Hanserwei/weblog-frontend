import axios, { type ApiResponse, type PageResponse } from '@/axios'
import type { BasePageQuery } from './category'

export interface PublishArticleReqVO {
  /**
   * 文章分类ID
   */
  categoryId: number
  /**
   * 文章内容
   */
  content: string
  /**
   * 文章封面图片URL
   */
  cover: string
  /**
   * 文章摘要
   */
  summary?: string
  /**
   * 文章标签列表
   */
  tags: (string | number)[]
  /**
   * 文章标题
   */
  title: string
}

export interface DeleteArticleReqVO {
  /**
   * 文章ID
   */
  id: number
}

export interface FindArticlePageListReqVO extends BasePageQuery {
  /**
   * 发布的结束日期
   */
  endDate?: string
  /**
   * 发布的起始日期
   */
  startDate?: string
  /**
   * 文章标题
   */
  title?: string
}

export interface FindArticlePageListRspVO {
  /**
   * 文章封面
   */
  cover?: string
  /**
   * 发布时间
   */
  createTime?: string
  /**
   * 文章 ID
   */
  id?: number
  /**
   * 文章标题
   */
  title?: string
}

export interface FindArticleDetailReqVO {
  /**
   * 文章 ID
   */
  id: number
}

export interface FindArticleDetailRspVO {
  /**
   * 分类 ID
   */
  categoryId?: number
  /**
   * 文章内容
   */
  content?: string
  /**
   * 文章封面
   */
  cover?: string
  /**
   * 文章 ID
   */
  id?: number
  /**
   * 摘要
   */
  summary?: string
  /**
   * 标签 ID 集合
   */
  tagIds?: number[]
  /**
   * 文章标题
   */
  title?: string
}

export interface UpdateArticleReqVO {
  /**
   * 分类ID
   */
  categoryId: number
  /**
   * 文章正文内容
   */
  content: string
  /**
   * 文章封面URI
   */
  cover: string
  /**
   * 文章ID
   */
  id: number
  /**
   * 文章摘要
   */
  summary?: string
  /**
   * 文章标签列表
   */
  tags: (string | number)[]
  /**
   * 文章标题
   */
  title: string
}

export function publishArticle(data: PublishArticleReqVO) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/article/publish', data)
}

export function deleteArticle(data: DeleteArticleReqVO) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/article/delete', data)
}

export function findArticlePageList(data: FindArticlePageListReqVO) {
  return axios.post<unknown, PageResponse<FindArticlePageListRspVO>>('/admin/article/list', data)
}

export function findArticleDetail(data: FindArticleDetailReqVO) {
  return axios.post<unknown, ApiResponse<FindArticleDetailRspVO>>('/admin/article/detail', data)
}

export function updateArticle(data: UpdateArticleReqVO) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/article/update', data)
}
