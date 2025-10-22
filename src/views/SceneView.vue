<template>
  <!-- 只有登录状态才渲染场景 -->
  <div v-if="isLogin" class="scene-view" :style="sceneBgStyle">
    <!-- 场景内容 -->
    <div class="scene-header">
      <el-button type="primary" @click="goBack">返回地图</el-button>
    </div>
    <div class="scene-content-wrapper">
      <component :is="currentScene" />
    </div>
  </div>
  <!-- 未登录时显示空白 -->
  <div v-else></div>
</template>

<script setup>
import { onMounted, computed, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useGameStore } from '@/stores/gameStore';

// stores & router
const userStore = useUserStore();
const gameStore = useGameStore();
const { isLogin } = storeToRefs(userStore); // 监听登录状态
const route = useRoute();
const router = useRouter();

// 当前场景 id
const sceneId = computed(() => route.params.id || 'village');

// 动态异步加载场景组件映射
const sceneMap = {
  village: () => import('@/components/scenes/VillageScene.vue'),
  library: () => import('@/components/scenes/LibraryScene.vue'),
  tavern: () => import('@/components/scenes/TavernScene.vue'),
  temple: () => import('@/components/scenes/TempleScene.vue'),
  treasureRoom: () => import('@/components/scenes/TreasureRoomScene.vue'),
  exit: () => import('@/components/scenes/ExitScene.vue')
};

const currentScene = computed(() => {
  const loader = sceneMap[sceneId.value];
  if (!loader) return defineAsyncComponent(() => import('@/components/scenes/VillageScene.vue'));
  return defineAsyncComponent(loader);
});

// 场景背景样式
const sceneBgStyle = computed(() => {
  const id = sceneId.value || '';
  let url = '';
  try {
    url = new URL(`/src/assets/images/${id}-bg.png`, import.meta.url).href;
  } catch (e) {
    url = new URL('/src/assets/images/Main Interface.png', import.meta.url).href;
  }
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    minHeight: '100vh'
  };
});

// 额外保险：如果未登录，立即跳转
onMounted(() => {
  // 仅初始化用户和游戏状态；登录保护由 router.beforeEach 管理，避免在场景内部触发导航
  userStore.loadUsers && userStore.loadUsers();
  gameStore.initGame && gameStore.initGame();
});

// 返回地图
const goBack = () => {
  router.push('/');
};
</script>