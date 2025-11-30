// utils/storage.ts
import { useCookies } from '@vueuse/integrations/useCookies'

// 1. 定义并导出 TabItem 接口，供组件使用
export interface ITabItem {
  title: string
  path: string
}

// 存储在 Cookie 中的 key
const TAB_LIST_KEY = 'tabList'
const cookie = useCookies()

// 2. 获取 TabList，增加返回类型注解
export function getTabList(): ITabItem[] {
  // 如果 cookie 中没有值，返回 undefined，我们在组件里处理默认值
  return cookie.get(TAB_LIST_KEY)
}

// 3. 存储 TabList，增加参数类型注解
export function setTabList(tabList: ITabItem[]) {
  cookie.set(TAB_LIST_KEY, tabList)
}
