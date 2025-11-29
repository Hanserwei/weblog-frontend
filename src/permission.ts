import router from '@/router/index'
import { getToken } from '@/composables/auth'
import { createDiscreteApi } from 'naive-ui'
import { showPageLoading, hidePageLoading } from './composables/utils'

const { message } = createDiscreteApi(['message'])

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  // 若用户想访问后台（以 /admin 为前缀的路由）
  // 未登录，则强制跳转登录页
  // 展示页面加载 Loading
  showPageLoading()
  const token = getToken()
  if (!token && to.path.startsWith('/admin')) {
    message.warning('请先登录')
    return next({ path: '/login', replace: true })
  } else if (token && to.path == '/login') {
    // 若用户已经登录，且重复访问登录页
    message.warning('请勿重复登录')
    // 跳转后台首页
    next({ path: '/admin/index' })
  } else {
    next()
  }
})

// 全局路由后置守卫
router.afterEach((to) => {
  // 动态设置页面 Title
  const title = (to.meta.title ? to.meta.title : '') + ' - Weblog'
  document.title = title
  // 隐藏页面加载 Loading
  hidePageLoading()
})
