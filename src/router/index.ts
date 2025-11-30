import LoginPage from '@/pages/admin/loginPage.vue'
import IndexPage from '@/pages/frontend/IndexPage.vue'
import AdminIndex from '@/pages/admin/IndexPage.vue'
import AdminArticleList from '@/pages/admin/ArticleList.vue'
import AdminCategoryList from '@/pages/admin/CategoryList.vue'
import AdminTagList from '@/pages/admin/TagList.vue'
import AdminBlogSetting from '@/pages/admin/BlogSetting.vue'
import Admin from '@/layouts/admin/AdminLayout.vue'
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
      path: '/admin', // 后台首页
      component: Admin, // 对应 admin.vue 布局文件
      // 使用到 admin.vue 布局的，都需要放置在其子路由下面
      children: [
        {
          path: '/admin/index',
          component: AdminIndex, // 主内容区域，具体需要渲染的页面
          meta: {
            title: '仪表盘',
          },
        },
        {
          path: '/admin/article/list',
          component: AdminArticleList,
          meta: {
            title: '文章管理',
          },
        },
        {
          path: '/admin/category/list',
          component: AdminCategoryList,
          meta: {
            title: '分类管理',
          },
        },
        {
          path: '/admin/tag/list',
          component: AdminTagList,
          meta: {
            title: '标签管理',
          },
        },
        {
          path: '/admin/blog/setting',
          component: AdminBlogSetting,
          meta: {
            title: '博客设置',
          },
        },
      ],
    },
  ],
})

export default router
