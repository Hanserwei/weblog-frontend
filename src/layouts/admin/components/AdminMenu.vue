<template>
  <div
    :class="['admin-menu h-full flex flex-col transition-colors duration-200', containerClasses]"
  >
    <div class="flex items-center justify-center px-4 py-3">
      <div class="flex items-center gap-2" :class="collapsed ? 'justify-center' : ''">
        <img src="@/assets/logo.svg" class="size-10" />
        <p v-if="!collapsed" class="text-xl font-sans">管理菜单</p>
      </div>
    </div>
    <n-menu
      :inverted="theme === 'dark'"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :theme-overrides="menuThemeOverrides[theme]"
      v-model:value="activeKey"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { NIcon, type GlobalThemeOverrides } from 'naive-ui'
import { RouterLink, useRoute } from 'vue-router'
import {
  DesktopOutline as Monitor,
  DocumentTextOutline as Document,
  FolderOpenOutline as FolderOpened,
  PricetagOutline as PriceTag,
  SettingsOutline as Setting,
} from '@vicons/ionicons5'

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()

const iconMap = {
  Monitor,
  Document,
  FolderOpened,
  PriceTag,
  Setting,
}

type IconName = keyof typeof iconMap

function renderIcon(iconName: IconName) {
  return () => h(NIcon, null, { default: () => h(iconMap[iconName]) })
}

type ThemeMode = 'light' | 'dark'

const theme = ref<ThemeMode>('dark')
let mediaQuery: MediaQueryList | null = null

const applySystemTheme = (event: MediaQueryList | MediaQueryListEvent) => {
  theme.value = event.matches ? 'dark' : 'light'
}

const menuThemeOverrides: Record<ThemeMode, GlobalThemeOverrides> = {
  light: {
    common: {
      primaryColor: '#2563eb',
    },
    Menu: {
      itemTextColor: '#475569',
      itemIconColor: '#94a3b8',
      itemTextColorActive: '#0f172a',
      itemIconColorActive: '#2563eb',
      itemTextColorHover: '#0f172a',
      itemIconColorHover: '#0f172a',
      itemColorHover: '#e8f0ff',
      itemColorActive: '#e8f0ff',
      itemColorActiveCollapsed: '#e8f0ff',
    },
  },
  dark: {
    common: {
      primaryColor: '#38bdf8',
    },
    Menu: {
      itemTextColor: '#cbd5e1',
      itemIconColor: '#94a3b8',
      itemTextColorActive: '#e2e8f0',
      itemIconColorActive: '#38bdf8',
      itemTextColorHover: '#e2e8f0',
      itemIconColorHover: '#e2e8f0',
      itemColorHover: '#1f2937',
      itemColorActive: '#0f172a',
      itemColorActiveCollapsed: '#1f2937',
    },
  },
}

const menus: Array<{ name: string; icon: IconName; path: string }> = [
  { name: '仪表盘', icon: 'Monitor', path: '/admin/index' },
  { name: '文章管理', icon: 'Document', path: '/admin/article/list' },
  { name: '分类管理', icon: 'FolderOpened', path: '/admin/category/list' },
  { name: '标签管理', icon: 'PriceTag', path: '/admin/tag/list' },
  { name: '博客设置', icon: 'Setting', path: '/admin/blog/setting' },
]

const menuOptions = menus.map((item) => ({
  label: () => h(RouterLink, { to: item.path }, { default: () => item.name }),
  key: item.path,
  icon: renderIcon(item.icon),
}))

const activeKey = ref(route.path)

watch(
  () => route.path,
  (newPath) => {
    activeKey.value = newPath
  },
)

const containerClasses = computed(() =>
  theme.value === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900',
)

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  applySystemTheme(mediaQuery)
  mediaQuery.addEventListener('change', applySystemTheme)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', applySystemTheme)
})
</script>
