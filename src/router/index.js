import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
  { path: '/scene/:id', name: 'Scene', component: () => import('@/views/SceneView.vue'), props: true },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
  { path: '/ranking', name: 'Ranking', component: () => import('@/views/RankingView.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫：同步验证登录状态，确保100%拦截未登录访问
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // 强制同步加载用户数据（避免异步导致的判断延迟）
  if (userStore._initialized !== true) {
    userStore.loadUsers();
    userStore._initialized = true;
  }

  // 未登录用户只能访问登录页
  if (to.name !== 'Login' && !userStore.isLogin) {
    next({ name: 'Login' });
    return; // 强制终止后续逻辑
  }

  // 已登录用户不能访问登录页
  if (to.name === 'Login' && userStore.isLogin) {
    next({ name: 'Home' });
    return;
  }

  // 正常访问
  next();
});

export default router;