<template>
  <div class="grid grid-cols-2 h-screen">
    <div class="col-span-2 order-2 md:col-span-1 md:order-1 bg-black">
      <div
        class="flex flex-col justify-center items-center h-full text-white px-10 space-y-6 max-w-3xl mx-auto animate__backInUp animate__animated"
      >
        <div class="text-center">
          <h2 class="font-bold text-4xl mb-4 text-white">Weblog 博客登录</h2>
          <p class="text-white">一款由 Spring Boot + Jpa + Vue 3 + Vite 7 开发的前后端分离博客。</p>
        </div>
        <img src="@/assets/developer.svg" class="w-3/4 max-w-xl" />
      </div>
    </div>

    <div class="col-span-2 order-1 md:col-span-1 md:order-2 bg-white">
      <div
        class="flex justify-center items-center h-full flex-col p-6 animate__fast animate__backInDown animate__animated"
      >
        <h1 class="text-3xl font-bold mb-4">欢迎回来</h1>
        <div class="text-gray-500 mb-8">账号密码登录</div>

        <n-form
          class="w-full sm:w-5/6 md:w-2/5"
          ref="formRef"
          :rules="rules"
          :model="form"
          label-placement="left"
        >
          <n-form-item path="username">
            <n-input
              size="large"
              v-model:value="form.username"
              placeholder="请输入用户名"
              @keydown.enter="onSubmit"
              clearable
            >
              <template #prefix>
                <n-icon :component="PersonOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              size="large"
              v-model:value="form.password"
              type="password"
              placeholder="请输入密码"
              @keydown.enter="onSubmit"
              show-password-on="click"
              clearable
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button
              block
              size="large"
              type="primary"
              strong
              @keydown.enter="onSubmit"
              @click="onSubmit"
              :loading="loading"
              >登录</n-button
            >
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { login } from '@/api/admin/user'
import { NForm, NFormItem, NInput, NButton, NIcon } from 'naive-ui'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import { reactive, ref } from 'vue'
import { setToken } from '@/composables/auth'
import { useRouter } from 'vue-router'
import type { FormInst, FormValidationError } from 'naive-ui'

const router = useRouter()
const loading = ref<boolean>(false)

// 定义响应式表单对象
const form = reactive({
  username: '',
  password: '',
})

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单验证规则 (Naive UI 的规则格式与 Element Plus 基本兼容)
const rules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: ['input', 'blur'],
    },
  ],
}

// 登录
const onSubmit = (e: MouseEvent | KeyboardEvent) => {
  e.preventDefault()
  // 验证逻辑
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      // --- 验证通过 ---
      console.log('验证通过')
      loading.value = true
      login(form.username, form.password)
        .then((res) => {
          console.log(res)
          const { success, data } = res.data
          if (success) {
            const token = data?.token
            if (token) {
              setToken(token)
            }
            router.push('/admin/index')
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      // --- 验证失败 ---
      console.log('表单验证不通过')
      console.log(errors)
    }
  })
}
</script>
