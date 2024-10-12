import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import '@/styles/common.scss'
import App from './App.vue'
import router from '@/router'
import pinia from '@/stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn
})
app.use(createPinia())
app.use(router)
app.use(pinia)
app.mount('#app')
