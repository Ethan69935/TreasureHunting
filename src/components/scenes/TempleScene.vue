<template>
  <div class="scene-content">
    <h1 class="page-title">神秘神庙</h1>
    
    <StatusPanel 
      :gold="gameStore.gameState.gold"
      :helpers="gameStore.gameState.helpers"
      :hasClue="gameStore.gameState.hasClue"
      :hasTreasure="gameStore.gameState.hasTreasure"
    />
    
    <el-card class="action-card">
      <h3>探索神庙</h3>
      <p v-if="!gameStore.gameState.hasClue" style="color: red;">⚠️ 没有藏宝图，无法进入神庙！</p>
      <p v-if="gameStore.gameState.helpers < 1 && gameStore.gameState.hasClue" style="color: red;">⚠️ 需要至少1名打手才能对抗守卫！</p>
      <p v-if="gameStore.gameState.hasClue">当前帮手: {{ gameStore.gameState.helpers }} 人</p>
      <el-button 
        type="primary" 
        @click="exploreTemple" 
        style="margin-top: 10px;"
        :disabled="!gameStore.gameState.hasClue || gameStore.gameState.helpers < 1 || gameStore.gameState.sceneCompleted.temple"
      >
        开始探索
      </el-button>
    </el-card>
    
    <LogViewer :logs="logs" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { storeToRefs } from 'pinia';
import StatusPanel from '@/components/common/StatusPanel.vue';
import LogViewer from '@/components/common/LogViewer.vue';

const router = useRouter();
const gameStore = useGameStore();
const { logs } = storeToRefs(gameStore);

const exploreTemple = () => {
  gameStore.exploreTemple();
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.scene-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  color: #333;
  font-size: 24px;
  margin: 0 0 30px 0;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.action-card {
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>