<template>
  <div class="scene-content">
    <h1 class="page-title">宝藏密室</h1>
    
    <StatusPanel 
      :gold="gameStore.gameState.gold"
      :helpers="gameStore.gameState.helpers"
      :hasClue="gameStore.gameState.hasClue"
      :hasTreasure="gameStore.gameState.hasTreasure"
    />
    
    <el-card class="action-card">
      <h3>寻找宝藏</h3>
      <p v-if="gameStore.gameState.helpers < 3" style="color: red;">⚠️ 需要至少3名打手才能安全获取宝藏！</p>
      <p>当前帮手: {{ gameStore.gameState.helpers }} 人</p>
      <el-button 
        type="primary" 
        @click="findTreasure" 
        style="margin-top: 10px;"
        :disabled="gameStore.gameState.helpers < 3 || gameStore.gameState.sceneCompleted.treasureRoom"
      >
        寻找宝藏
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

const findTreasure = () => {
  gameStore.findTreasure();
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