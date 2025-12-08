import { defineStore } from 'pinia'
import { ref } from 'vue'
// 注意：请确认这里引入了正确的 API 方法和 类型定义
import { findDetail } from '@/api/frontend/settings'
import type { FindBlogSettingsDetailRspVO } from '@/api/frontend/settings'

export const useBlogSettingsStore = defineStore('blogSettings', () => {
  // 1. 定义 State
  // 这里使用 {} as ... 是为了初始化时不报错，且保留类型推断
  // 或者你也可以写成 ref<Partial<FindBlogSettingsDetailRspVO>>({})
  const blogSettings = ref<FindBlogSettingsDetailRspVO>({} as FindBlogSettingsDetailRspVO)

  // 2. 定义 Action
  const getBlogSettings = async () => {
    console.log('开始获取博客设置信息...')
    try {
      const res = await findDetail()
      if (res.success) {
        blogSettings.value = res.data
      }
    } catch (error) {
      console.error('获取博客设置失败:', error)
    }
  }

  return {
    blogSettings,
    getBlogSettings,
  }
})
