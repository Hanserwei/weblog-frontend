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
        <h1 class="text-3xl font-bold mb-4 **text-center**">欢迎回来</h1>
        <div class="text-gray-500 mb-8 **text-center**">账号密码登录</div>

        <n-form class="w-full sm:w-5/6 md:w-2/5">
          <n-form-item>
            <n-input size="large" placeholder="请输入用户名" clearable>
              <template #prefix>
                <n-icon :component="PersonOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-input size="large" type="password" placeholder="请输入密码" clearable>
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button block size="large" type="primary" strong>登录</n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, NIcon } from 'naive-ui'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
</script>
