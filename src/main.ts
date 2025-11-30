import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'animate.css'
// 导入全局路由守卫
import '@/permission'

import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import 'nprogress/nprogress.css'
import 'flowbite'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)

app.mount('#app')
