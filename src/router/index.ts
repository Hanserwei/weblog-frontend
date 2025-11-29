import LoginPage from '@/pages/admin/loginPage.vue'
import IndexPage from '@/pages/frontend/IndexPage.vue'
import AdminIndex from '@/pages/admin/IndexPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexPage,
      meta: {
        title: 'Weblog 首页',
      },
    },
    {
      path: '/login',
      component: LoginPage,
      meta: {
        title: 'Weblog 登录页',
      },
    },
    {
      path: '/admin/index',
      component: AdminIndex,
      meta: {
        title: 'Admin 首页',
      },
    },
  ],
})

export default router
