import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

// 确保先初始化Pinia再加载路由
app.use(pinia)
// 初始化用户状态（从 localStorage 加载 currentUser），以便路由守卫能正确判断登录状态
import { useUserStore } from '@/stores/userStore';
// 在应用层面使用 pinia 实例创建 store，避免无效的 activePinia 问题
const userStore = useUserStore(pinia);
userStore.loadUsers && userStore.loadUsers();
app.use(router)
app.use(ElementPlus)
app.mount('#app')