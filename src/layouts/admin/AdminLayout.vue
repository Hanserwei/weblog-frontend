<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
      show-trigger
      v-model:collapsed="collapsed"
    >
      <AdminMenu :collapsed="collapsed" />
    </n-layout-sider>

    <n-layout
      :content-style="{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }"
    >
      <n-layout-header bordered>
        <AdminHeader />
        <AdminTagList />
      </n-layout-header>

      <n-layout-content
        class="bg-gray-50 flex-1"
        :content-style="{ padding: '20px' }"
        :native-scrollbar="false"
      >
        <router-view v-slot="{ Component }">
          <Transition name="fade">
            <!-- max 指定最多缓存 10 个组件 -->
            <KeepAlive :max="10">
              <component :is="Component"></component>
            </KeepAlive>
          </Transition>
        </router-view>
      </n-layout-content>

      <n-layout-footer bordered class="p-4 text-center">
        <AdminFooter />
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NLayoutFooter } from 'naive-ui'
import { storeToRefs } from 'pinia'

// 引入自定义组件
import AdminFooter from './components/AdminFooter.vue'
import AdminHeader from './components/AdminHeader.vue'
import AdminMenu from './components/AdminMenu.vue'
import AdminTagList from './components/AdminTagList.vue'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
const { collapsed } = storeToRefs(layoutStore)
</script>

<style scoped>
.n-layout-header {
  padding: 0;
  height: auto;
}

/* 如果 Tailwind 的 flex-1 没生效（有时会被 Naive 样式覆盖），
  可以强制指定 n-layout-content 的 flex 属性
*/
:deep(.n-layout-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 内容区域过渡动画：淡入淡出效果 */
/* 刚开始进入时 */
.fade-enter-from {
  /* 透明度 */
  opacity: 0;
}

/* 刚开始结束 */
.fade-enter-to {
  opacity: 1;
}

/* 刚开始离开 */
.fade-leave-from {
  opacity: 1;
}

/* 离开已结束 */
.fade-leave-to {
  opacity: 0;
}

/* 离开进行中 */
.fade-leave-active {
  transition: all 0.3s;
}

/* 进入进行中 */
.fade-enter-active {
  transition: all 0.3s;
  transition-delay: 0.3s;
}
</style>
