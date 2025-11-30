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
            class="flex items-center gap-1 rounded-full px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            @click="handleRefresh"
          >
            <n-icon size="18"><RefreshOutline /></n-icon>
            <span class="hidden sm:inline">刷新</span>
          </button>
        </template>
        <span>刷新</span>
      </n-tooltip>

      <n-tooltip trigger="hover">
        <template #trigger>
          <button
            class="flex items-center gap-1 rounded-full px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            @click="toggle"
          >
            <n-icon size="18"
              ><component :is="isFullscreen ? ContractOutline : ExpandOutline"
            /></n-icon>
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
          <span class="ml-2 font-medium">{{ userStore.userInfo?.username || 'Admin' }}</span>
          <n-icon class="ml-1"><ChevronDown /></n-icon>
        </div>
      </n-dropdown>
    </div>
  </div>

  <n-modal
    v-model:show="showPasswordModal"
    preset="card"
    title="修改密码"
    style="width: 600px; max-width: 90%"
    :bordered="false"
    :segmented="{ content: 'soft', footer: 'soft' }"
  >
    <div class="p-6">
      <n-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="100px"
        require-mark-placement="right-hanging"
        size="medium"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="formModel.username" disabled placeholder="用户名" />
        </n-form-item>

        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formModel.password"
            type="password"
            show-password-on="click"
            placeholder="请输入新密码"
          />
        </n-form-item>

        <n-form-item label="确认密码" path="rePassword">
          <n-input
            v-model:value="formModel.rePassword"
            type="password"
            show-password-on="click"
            placeholder="请再次输入新密码"
            @keydown.enter.prevent
          />
        </n-form-item>
      </n-form>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 px-6 pb-2">
        <n-button @click="closeModal">取消</n-button>
        <n-button type="primary" @click="handlePasswordSubmit">确定</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ExpandOutline, ContractOutline, ChevronDown, RefreshOutline } from '@vicons/ionicons5'
import {
  NIcon,
  NDropdown,
  NAvatar,
  useMessage,
  useDialog,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NButton,
  type FormInst,
  type FormRules,
} from 'naive-ui'
import { computed, ref, reactive } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { updateAdminPassword, type UpdateAdminUserPasswordRequest } from '@/api/admin/user'
import router from '@/router'

const userStore = useUserStore()
const message = useMessage()
const dialog = useDialog()
const route = useRoute()

// --- 弹窗相关状态 ---
const showPasswordModal = ref(false)
const formRef = ref<FormInst | null>(null)

// 表单数据模型
const formModel = reactive<UpdateAdminUserPasswordRequest>({
  username: '',
  password: '',
  rePassword: '',
})

// 表单校验规则
const rules: FormRules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  rePassword: [
    { required: true, message: '确认密码不能为空', trigger: ['input', 'blur'] },
    {
      validator: (rule, value) => {
        return value === formModel.password
      },
      message: '两次输入密码不一致',
      trigger: ['input', 'blur'], // 输入时也实时校验
    },
  ],
}

// 打开弹窗
const openChangePasswordModal = () => {
  // 1. 获取当前用户名
  formModel.username = userStore.userInfo?.username || '未知用户'
  // 2. 清空之前的密码输入
  formModel.password = ''
  formModel.rePassword = ''
  // 3. 打开弹窗
  showPasswordModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showPasswordModal.value = false
}

// 提交逻辑
const handlePasswordSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // TODO: 在这里调用后端修改密码接口
      // const res = await api.changePassword(...)
      const res = await updateAdminPassword(formModel)
      if (res.success) {
        message.success('密码修改成功，请重新登录！')
        userStore.logout()
        router.push('/login')
      }
      closeModal()
    } else {
      console.log(errors)
      message.error('请检查输入内容')
    }
  })
}

// --- 下拉菜单逻辑 ---
const dropdownOptions = [
  { label: '修改密码', key: 'change_password' },
  { label: '退出登录', key: 'logout' },
]

const handleSelect = (key: string) => {
  if (key === 'logout') {
    dialog.warning({
      title: '提示',
      content: '确认要退出登录吗？',
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.logout()
        message.success('已退出登录')
      },
    })
  } else if (key === 'change_password') {
    openChangePasswordModal() // 调用打开弹窗方法
  }
}

// --- 其他通用逻辑 (全屏/刷新) ---
const { isFullscreen, toggle } = useFullscreen()
const handleRefresh = () => window.location.reload()
const pageTitle = computed(() => (route.meta.title as string) || '后台管理')
const fullscreenText = computed(() => (isFullscreen.value ? '退出全屏' : '全屏展开'))
</script>
