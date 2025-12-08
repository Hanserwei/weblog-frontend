<template>
  <nav class="bg-white border-gray-200 border-b dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center">
        <img
          :src="blogSettings.logo || 'http://likeyy.love/upload/dog.svg'"
          class="h-8 mr-3 rounded-full"
          alt="Blog Logo"
        />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          伍小维的博客
        </span>
      </a>

      <div class="flex md:order-2 items-center">
        <button
          type="button"
          data-collapse-toggle="navbar-search"
          aria-controls="navbar-search"
          aria-expanded="false"
          class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search</span>
        </button>

        <div class="relative hidden md:block">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search icon</span>
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="请输入关键词..."
          />
        </div>

        <div
          v-if="!isLogin"
          @click="router.push('/login')"
          class="text-gray-900 ml-4 mr-1 hover:text-blue-700 dark:text-white cursor-pointer select-none font-medium"
        >
          登录
        </div>

        <div
          v-else
          class="flex items-center ml-3 relative"
          @mouseenter="isDropdownVisible = true"
          @mouseleave="isDropdownVisible = false"
        >
          <button
            type="button"
            class="flex text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-transform hover:scale-105"
            id="user-menu-button"
          >
            <span class="sr-only">Open user menu</span>
            <img class="w-8 h-8 rounded-full object-cover" :src="userAvatar" alt="user photo" />
          </button>

          <div v-show="isDropdownVisible" class="absolute right-0 top-full pt-2 z-50 w-48">
            <div
              class="bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 border border-gray-100 dark:border-gray-600"
            >
              <div class="px-4 py-3">
                <span class="block text-sm text-gray-900 dark:text-white font-bold">{{
                  username
                }}</span>
                <span class="block text-sm text-gray-500 truncate dark:text-gray-400">管理员</span>
              </div>
              <ul
                class="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="user-menu-button"
              >
                <li>
                  <a
                    @click="router.push('/admin')"
                    class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors"
                  >
                    <n-icon size="18" class="mr-2">
                      <SpeedometerOutline />
                    </n-icon>
                    进入后台
                  </a>
                </li>
                <li>
                  <a
                    @click="handleLogout"
                    class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors text-red-500 dark:text-red-400"
                  >
                    <n-icon size="18" class="mr-2">
                      <LogOutOutline />
                    </n-icon>
                    退出登录
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          data-collapse-toggle="navbar-search"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ml-2"
          aria-controls="navbar-search"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>

      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-search"
      >
        <div class="relative mt-3 md:hidden">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <a
              href="#"
              class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
              aria-current="page"
              >首页</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >分类</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >标签</a
            >
          </li>
          <li>
            <a
              href="#"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >归档</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { initCollapses } from 'flowbite'
import { useRouter } from 'vue-router'
import { useMessage, NIcon } from 'naive-ui'
import { SpeedometerOutline, LogOutOutline } from '@vicons/ionicons5'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useUserStore } from '@/stores/user'
// 1. 引入 store 和 storeToRefs
import { useBlogSettingsStore } from '@/stores/blogSettings'
import { storeToRefs } from 'pinia'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()
const TOKEN_KEY = 'Authorization'
const cookie = useCookies()

// 2. 初始化 Store
const settingsStore = useBlogSettingsStore()
// 使用 storeToRefs 保持响应性，解构出 blogSettings
const { blogSettings } = storeToRefs(settingsStore)

const isLogin = ref(!!cookie.get(TOKEN_KEY))
const isDropdownVisible = ref(false)

// 计算属性：头像
const userAvatar = computed(() => {
  return (
    blogSettings.value.avatar || 'https://flowbite.com/docs/images/people/profile-picture-3.jpg'
  )
})

// 计算属性：用户名
const username = computed(() => userStore.userInfo?.username || blogSettings.value.author || 'User')

onMounted(async () => {
  initCollapses()

  // 3. 调用 Store 中的 action 获取数据
  await settingsStore.getBlogSettings()
})

const handleLogout = () => {
  userStore.logout()
  message.success('退出登录成功')
  isDropdownVisible.value = false
  isLogin.value = false
  router.push('/login')
}
</script>
