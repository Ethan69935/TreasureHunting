<template>
  <div class="scene-content">
    <h1 class="page-title">宁静村庄</h1>
    
    <StatusPanel 
      :gold="gameStore.gameState.gold"
      :helpers="gameStore.gameState.helpers"
      :hasClue="gameStore.gameState.hasClue"
      :hasTreasure="gameStore.gameState.hasTreasure"
    />
    
    <el-card class="action-card">
      <h3>探索村庄</h3>
      <p>据说村里藏有一张古老的地图...</p>
      <el-button 
        type="primary" 
        @click="exploreVillage" 
        style="margin-top: 10px;"
        :disabled="gameStore.gameState.sceneCompleted.village"
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

const exploreVillage = () => {
  gameStore.exploreVillage();
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