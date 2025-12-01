<template>
  <div
    class="admin-header h-16 flex items-center px-5 justify-between border-b transition-colors duration-300"
  >
    <div class="flex items-center gap-2">
      <span
        class="text-sm uppercase tracking-wide transition-colors"
        :style="{ color: themeVars.textColor3 }"
        >Admin</span
      >
      <span
        class="w-px h-4 transition-colors"
        :style="{ backgroundColor: themeVars.dividerColor }"
      ></span>
      <span
        class="text-base font-semibold transition-colors"
        :style="{ color: themeVars.textColor1 }"
        >{{ pageTitle }}</span
      >
    </div>

    <div class="flex items-center gap-4">
      <n-tooltip placement="bottom">
        <template #trigger>
          <button
            class="toolbar-btn flex items-center gap-1 rounded-full px-3 py-1 text-sm border transition-colors"
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
            class="toolbar-btn flex items-center gap-1 rounded-full px-3 py-1 text-sm border transition-colors"
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
          class="user-trigger flex items-center cursor-pointer rounded-full px-2 py-1 transition-colors"
        >
          <n-avatar round size="small" src="https://avatars.githubusercontent.com/u/78295104?v=4" />
          <span class="ml-2 font-medium" :style="{ color: themeVars.textColor2 }">{{
            userStore.userInfo?.username || 'Admin'
          }}</span>
          <n-icon class="ml-1" :style="{ color: themeVars.textColor3 }"><ChevronDown /></n-icon>
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
import { computed, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
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
  useThemeVars, // <--- 新增引入
  type FormInst,
  type FormRules,
} from 'naive-ui'
import { useFullscreen } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { updateAdminPassword, type UpdateAdminUserPasswordRequest } from '@/api/admin/user'

// --- 获取 Naive UI 主题变量 ---
const themeVars = useThemeVars()

const userStore = useUserStore()
const message = useMessage()
const dialog = useDialog()
const route = useRoute()

// ==========================================
// part 1: 修改密码弹窗逻辑 (保持不变)
// ==========================================
const showPasswordModal = ref(false)
const formRef = ref<FormInst | null>(null)
const formModel = reactive<UpdateAdminUserPasswordRequest>({
  username: '',
  password: '',
  rePassword: '',
})
const rules: FormRules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  rePassword: [
    { required: true, message: '确认密码不能为空', trigger: ['input', 'blur'] },
    {
      validator: (rule, value) => value === formModel.password,
      message: '两次输入密码不一致',
      trigger: ['input', 'blur'],
    },
  ],
}
const openChangePasswordModal = () => {
  formModel.username = userStore.userInfo?.username || '未知用户'
  formModel.password = ''
  formModel.rePassword = ''
  showPasswordModal.value = true
}
const closeModal = () => {
  showPasswordModal.value = false
}
const handlePasswordSubmit = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await updateAdminPassword(formModel)
      if (res.success) {
        message.success('密码修改成功，请重新登录！')
        userStore.logout()
        router.push('/login')
      }
      closeModal()
    } else {
      message.error('请检查输入内容')
    }
  })
}

// ==========================================
// part 2: 用户下拉菜单逻辑 (保持不变)
// ==========================================
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
        router.push('/login')
      },
    })
  } else if (key === 'change_password') {
    openChangePasswordModal()
  }
}

// ==========================================
// part 3: 通用工具栏逻辑 (保持不变)
// ==========================================
const { isFullscreen, toggle } = useFullscreen()
const fullscreenText = computed(() => (isFullscreen.value ? '退出全屏' : '全屏展开'))
const handleRefresh = () => window.location.reload()
const pageTitle = computed(() => (route.meta.title as string) || '后台管理')
</script>

<style scoped>
/* 使用 Vue 3 的 CSS v-bind 特性
  直接将 Naive UI 的主题变量绑定到 CSS 属性中
*/
.admin-header {
  background-color: v-bind('themeVars.bodyColor');
  border-bottom-color: v-bind('themeVars.dividerColor');
}

/* 工具栏按钮样式 */
.toolbar-btn {
  /* 使用组件通用边框色 */
  border-color: v-bind('themeVars.borderColor');
  /* 使用二级文本色 */
  color: v-bind('themeVars.textColor2');
}

.toolbar-btn:hover {
  /* 使用 Naive UI 标准的悬浮背景色 */
  background-color: v-bind('themeVars.hoverColor');
  /* 悬浮时文本色稍微变亮一点，使用一级文本色 */
  color: v-bind('themeVars.textColor1');
}

/* 用户触发器样式 */
.user-trigger:hover {
  background-color: v-bind('themeVars.hoverColor');
}
</style>
