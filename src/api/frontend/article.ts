import axios, { type PageResponse } from '@/axios'

export interface FindIndexArticlePageListReqVO {
  /**
   * 当前页码, 默认第一页
   */
  current?: number
  /**
   * 每页展示的数据数量，默认每页展示 10 条数据
   */
  size?: number
}

export interface FindIndexArticlePageListRspVO {
  /**
   * 文章分类
   */
  category?: FindCategoryListRspVO
  /**
   * 封面url
   */
  cover?: string
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 文章id
   */
  id?: number
  /**
   * 摘要
   */
  summary?: string
  /**
   * 文章标签
   */
  tags?: FindTagListRspVO[]
  /**
   * 标题
   */
  title?: string
}

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

export function findArticlePageList(data: FindIndexArticlePageListReqVO) {
  return axios.post<unknown, PageResponse<FindIndexArticlePageListRspVO>>('/article/list', data)
}
