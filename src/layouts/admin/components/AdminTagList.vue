<template>
  <div class="h-11 px-2 flex items-center bg-white border-b border-gray-200 shadow-sm mt-3">
    <div class="flex-1 overflow-hidden">
      <n-tabs
        :value="editableTabsValue"
        type="card"
        size="small"
        @update:value="handleTabClick"
        @close="handleClose"
      >
        <n-tab-pane
          v-for="item in editableTabs"
          :key="item.path"
          :tab="item.title"
          :name="item.path"
          :closable="item.path !== '/admin/index'"
        >
        </n-tab-pane>
      </n-tabs>
    </div>

    <span class="ml-auto pl-2 flex items-center">
      <n-dropdown trigger="hover" :options="dropdownOptions" @select="handleSelect">
        <n-icon size="18" class="cursor-pointer text-gray-600 hover:text-blue-500 align-middle">
          <ChevronDown />
        </n-icon>
      </n-dropdown>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NTabs, NTabPane, NDropdown, NIcon } from 'naive-ui'
import { ChevronDown } from '@vicons/ionicons5'
import type { DropdownOption } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { getTabList, setTabList, type ITabItem } from '@/composables/tag-list'

const route = useRoute()
const router = useRouter()

const editableTabsValue = ref<string>('/admin/index')

// 尝试从 Cookie 获取，如果没有(undefined或空数组)，则默认只显示仪表盘
const cachedTabs = getTabList()
const defaultTabs: ITabItem[] = [{ title: '仪表盘', path: '/admin/index' }]
const editableTabs = ref<ITabItem[]>(cachedTabs || defaultTabs)

const dropdownOptions: DropdownOption[] = [
  { label: '关闭其他', key: 'close-others' },
  { label: '关闭全部', key: 'close-all' },
]

// 【关键修改 2】监听 Tab 列表变化，持久化到 Cookie
watch(
  editableTabs,
  (newTabs) => {
    setTabList(newTabs)
  },
  { deep: true }, // 深度监听，确保数组内部变动也能触发
)

// 1. 监听路由变化 (Route -> Tab)
watch(
  () => route.path,
  (newPath) => {
    editableTabsValue.value = newPath

    const title = (route.meta.title as string) || '未命名'

    const isExist = editableTabs.value.some((item) => item.path === newPath)
    if (!isExist) {
      editableTabs.value.push({ title, path: newPath })
    }
  },
  { immediate: true },
)

// 2. 处理 Tab 点击 (Tab -> Route)
const handleTabClick = (path: string) => {
  editableTabsValue.value = path
  router.push(path)
}

// 3. 处理关闭事件
const handleClose = (targetPath: string) => {
  if (targetPath === '/admin/index') return

  const tabs = editableTabs.value
  let activePath = editableTabsValue.value

  if (activePath === targetPath) {
    tabs.forEach((tab, index) => {
      if (tab.path === targetPath) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activePath = nextTab.path
        }
      }
    })
  }

  editableTabs.value = tabs.filter((tab) => tab.path !== targetPath)

  if (activePath !== targetPath) {
    editableTabsValue.value = activePath
    router.push(activePath)
  }
}

const handleSelect = (key: string) => {
  if (key === 'close-others') {
    closeOtherTabs()
  } else if (key === 'close-all') {
    closeAllTabs()
  }
}

const closeOtherTabs = () => {
  editableTabs.value = editableTabs.value.filter(
    (tab) => tab.path === '/admin/index' || tab.path === editableTabsValue.value,
  )
}

const closeAllTabs = () => {
  editableTabs.value = editableTabs.value.filter((tab) => tab.path === '/admin/index')
  editableTabsValue.value = '/admin/index'
  router.push('/admin/index')
}
</script>

<style scoped>
:deep(.n-tabs .n-tabs-bar) {
  display: none;
}
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab) {
  height: 36px;
}
</style>
