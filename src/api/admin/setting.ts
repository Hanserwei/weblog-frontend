import axios, { type ApiResponse } from '@/axios'

export interface UpdateBlogSettingsReqVO {
  /**
   * 博客作者
   */
  author: string
  /**
   * 博客头像
   */
  avatar: string
  /**
   * CSDN 主页
   */
  csdnHomepage?: string
  /**
   * Gitee 主页
   */
  giteeHomepage?: string
  /**
   * GitHub 主页
   */
  githubHomepage?: string
  /**
   * 博客介绍语
   */
  introduction: string
  /**
   * 博客 LOGO
   */
  logo: string
  /**
   * 博客名称
   */
  name: string
  /**
   * 知乎主页
   */
  zhihuHomepage?: string
}

export interface FindBlogSettingsRspVO {
  /**
   * 作者名称
   */
  author?: string
  /**
   * 作者头像
   */
  avatar?: string
  /**
   * CSDN 主页地址
   */
  csdnHomepage?: string
  /**
   * Gitee 主页地址
   */
  giteeHomepage?: string
  /**
   * GitHub 主页地址
   */
  githubHomepage?: string
  /**
   * 博客介绍
   */
  introduction?: string
  /**
   * 博客 Logo
   */
  logo?: string
  /**
   * 博客名称
   */
  name?: string
  /**
   * 知乎主页地址
   */
  zhihuHomepage?: string
}

export function UpdateBlogSettings(data: UpdateBlogSettingsReqVO) {
  return axios.post<unknown, ApiResponse<unknown>>('/admin/blog/settings/update', data)
}

export function FindBlogSettings() {
  return axios.post<unknown, ApiResponse<FindBlogSettingsRspVO>>('/admin/blog/settings/detail')
}
