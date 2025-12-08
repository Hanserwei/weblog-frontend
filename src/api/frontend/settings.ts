import axios, { type ApiResponse } from '@/axios'

export interface FindBlogSettingsDetailRspVO {
  /**
   * 作者名称
   */
  author?: string
  /**
   * 作者头像
   */
  avatar?: string
  /**
   * CSDN主页
   */
  csdnHomepage?: string
  /**
   * Gitee主页
   */
  giteeHomepage?: string
  /**
   * GitHub主页
   */
  githubHomepage?: string
  /**
   * 博客介绍
   */
  introduction?: string
  /**
   * 博客Logo
   */
  logo?: string
  /**
   * 博客名称
   */
  name?: string
  /**
   * 知乎主页
   */
  zhihuHomepage?: string
}

export function findDetail() {
  return axios.post<unknown, ApiResponse<FindBlogSettingsDetailRspVO>>('/blog/settings/detail')
}
