<template>
  <div class="admin-menu h-full flex flex-col transition-colors duration-300 border-r">
    <div class="flex items-center justify-center h-16 px-4">
      <div
        class="flex items-center gap-2 overflow-hidden whitespace-nowrap"
        :class="collapsed ? 'justify-center' : ''"
      >
        <img src="@/assets/logo.svg" class="size-8" alt="Logo" />
        <p v-if="!collapsed" class="text-xl font-bold transition-colors menu-title">管理菜单</p>
      </div>
    </div>

    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      v-model:value="activeKey"
    />
  </div>
</template>

<script setup lang="ts">
// --- Imports: Vue Core & Router ---
import { h, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

// --- Imports: UI Components & Icons ---
import { NIcon, useThemeVars } from 'naive-ui'
import {
  DesktopOutline as Monitor,
  DocumentTextOutline as Document,
  FolderOpenOutline as FolderOpened,
  PricetagOutline as PriceTag,
  SettingsOutline as Setting,
} from '@vicons/ionicons5'

// --- Props Definition ---
defineProps<{
  collapsed: boolean
}>()

// --- 全局 Hooks ---
const route = useRoute()
const themeVars = useThemeVars() // 获取当前主题变量

// ==========================================
// part 1: 图标与菜单配置
// ==========================================

// 图标映射表
const iconMap = {
  Monitor,
  Document,
  FolderOpened,
  PriceTag,
  Setting,
}

type IconName = keyof typeof iconMap

/**
 * 渲染图标的辅助函数
 */
function renderIcon(iconName: IconName) {
  return () => h(NIcon, null, { default: () => h(iconMap[iconName]) })
}

// 菜单数据源 (通常建议这里将来从 API 获取或专门的配置件引入)
const menus: Array<{ name: string; icon: IconName; path: string }> = [
  { name: '仪表盘', icon: 'Monitor', path: '/admin/index' },
  { name: '文章管理', icon: 'Document', path: '/admin/article/list' },
  { name: '分类管理', icon: 'FolderOpened', path: '/admin/category/list' },
  { name: '标签管理', icon: 'PriceTag', path: '/admin/tag/list' },
  { name: '博客设置', icon: 'Setting', path: '/admin/blog/setting' },
]

/**
 * 构建 Naive UI 菜单所需的 Options 结构
 * 使用 RouterLink 包装 label 以实现路由跳转
 */
const menuOptions = menus.map((item) => ({
  label: () => h(RouterLink, { to: item.path }, { default: () => item.name }),
  key: item.path,
  icon: renderIcon(item.icon),
}))

// ==========================================
// part 2: 状态管理 (路由同步)
// ==========================================

// 当前激活的菜单项 key
const activeKey = ref(route.path)

// 监听路由变化，自动高亮对应菜单
watch(
  () => route.path,
  (newPath) => {
    activeKey.value = newPath
  },
)
</script>

<style scoped>
.admin-menu {
  /* * 修正：siderColor 不存在，改为 cardColor
   * cardColor 在亮色模式下是白色，在暗色模式下是深灰色(#18181c)，非常适合侧边栏
   */
  background-color: v-bind('themeVars.cardColor');
  border-right: 1px solid v-bind('themeVars.dividerColor'); /* 显式指定右边框 */
}

.menu-title {
  color: v-bind('themeVars.textColor1');
}
</style>
