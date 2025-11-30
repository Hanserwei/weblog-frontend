<template>
  <div
    class="h-16 flex items-center px-5 justify-between border-b bg-white/80 backdrop-blur dark:bg-[#18181c]/90 dark:border-gray-800 border-gray-200 text-slate-900 dark:text-gray-100 transition-colors duration-300"
  >
    <div class="flex items-center gap-2">
      <span class="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Admin</span>
      <span class="w-px h-4 bg-gray-300 dark:bg-gray-600"></span>
      <span class="text-base font-semibold">{{ pageTitle }}</span>
    </div>

    <div class="flex items-center gap-4">
      <n-tooltip placement="bottom">
        <template #trigger>
          <button
            type="button"
            class="flex items-center gap-1 rounded-full px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            @click="handleRefresh"
          >
            <n-icon size="18">
              <RefreshOutline />
            </n-icon>
            <span class="hidden sm:inline">刷新</span>
          </button>
        </template>
        <span>刷新</span>
      </n-tooltip>

      <n-tooltip trigger="hover">
        <template #trigger>
          <button
            type="button"
            class="flex items-center gap-1 rounded-full px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            @click="toggle"
          >
            <n-icon size="18">
              <component :is="isFullscreen ? ContractOutline : ExpandOutline" />
            </n-icon>
            <span class="hidden sm:inline">{{ isFullscreen ? '退出全屏' : '展开全屏' }}</span>
          </button>
        </template>
        {{ fullscreenText }}
      </n-tooltip>

      <n-dropdown :options="dropdownOptions" @select="handleSelect">
        <div
          class="flex items-center cursor-pointer rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
        >
          <n-avatar round size="small" src="https://avatars.githubusercontent.com/u/78295104?v=4" />
          <span class="ml-2 font-medium">{{ userStore.userInfo?.username }}</span>
          <n-icon class="ml-1">
            <ChevronDown />
          </n-icon>
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExpandOutline, ContractOutline, ChevronDown, RefreshOutline } from '@vicons/ionicons5'
import { NIcon, NDropdown, NAvatar, useMessage } from 'naive-ui'
import { computed } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const message = useMessage()
const route = useRoute()

const dropdownOptions = [
  { label: '修改密码', key: 'change_password' },
  { label: '退出登录', key: 'logout' },
]

const handleSelect = (key: string) => {
  if (key === 'logout') {
    message.success('已退出登录')
  } else if (key === 'change_password') {
    console.log('打开修改密码弹窗')
  }
}

const { isFullscreen, toggle } = useFullscreen()
const handleRefresh = () => {
  window.location.reload()
}

const pageTitle = computed(() => (route.meta.title as string) || '后台管理')
const fullscreenText = computed(() => (isFullscreen.value ? '退出全屏' : '全屏展开'))
</script>
