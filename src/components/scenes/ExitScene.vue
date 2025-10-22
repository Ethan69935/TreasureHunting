<template>
  <div class="scene-content">
    <h1 class="page-title">胜利出口</h1>
    
    <StatusPanel 
      :gold="gameStore.gameState.gold"
      :helpers="gameStore.gameState.helpers"
      :hasClue="gameStore.gameState.hasClue"
      :hasTreasure="gameStore.gameState.hasTreasure"
    />
    
    <el-card class="action-card">
      <h3>冒险结算</h3>
      <p v-if="gameStore.gameState.hasTreasure">
        🎉 恭喜！你成功找到宝藏，获得了 {{ treasureReward }} 金币奖励！
      </p>
      <p v-if="gameStore.gameState.hasTreasure">
        最终得分: {{ gameStore.gameState.score + treasureReward }}
      </p>
      <p v-else>
        你尚未找到宝藏，无法结算奖励
      </p>
      <p>当前总金币: {{ gameStore.gameState.gold + (gameStore.gameState.hasTreasure ? treasureReward : 0) }}</p>
      
      <!-- 结束冒险按钮 -->
      <el-button 
        type="primary" 
        @click="completeGame" 
        style="margin-top: 10px; margin-right: 10px;"
        :disabled="!gameStore.gameState.hasTreasure || gameStore.gameState.gameCompleted"
      >
        结算奖励
      </el-button>
      
      <!-- 重新开始按钮 -->
      <el-button 
        type="warning" 
        @click="restartAdventure" 
        style="margin-top: 10px;"
      >
        重新开始冒险
      </el-button>
      
      <!-- 查看排行榜按钮 -->
      <el-button 
        type="info" 
        @click="goToRanking" 
        style="margin-top: 10px; margin-left: 10px;"
      >
        查看排行榜
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

const treasureReward = 100;

// 完成游戏，结算奖励
const completeGame = () => {
  if (!gameStore.gameState.hasTreasure) return;
  
  gameStore.completeGame();
};

// 重新开始冒险
const restartAdventure = () => {
  gameStore.resetGame();
  gameStore.addLog('冒险已重置，重新开始探索吧！', 'info');
  router.push('/');
};

// 前往排行榜
const goToRanking = () => {
  router.push('/ranking');
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