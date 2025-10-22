<template>
  <div class="scene-content">
    <!-- 自定义标题，无Back按钮 -->
    <h1 class="page-title">古老图书馆</h1>
    
    <el-card class="action-card">
      <h3>寻找藏宝图线索</h3>
      <p>你需要在古籍中找到通往神庙的线索...</p>
      <el-button 
        type="primary" 
        @click="searchBooks" 
        style="margin-top: 10px;"
        :disabled="gameStore.gameState.sceneCompleted.library"
      >
        翻阅古籍
      </el-button>
    </el-card>
    
    <el-card class="log-card" style="margin-top: 20px;">
      <h4>冒险日志</h4>
      <ul>
        <li v-for="(log, index) in logs" :key="index">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const gameStore = useGameStore();
const { logs } = storeToRefs(gameStore);

// 翻阅古籍
const searchBooks = () => {
  gameStore.searchBooks();
};

// 返回主页（如需可保留，通过其他按钮触发）
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

/* 统一标题样式 */
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
.log-card {
  max-height: 300px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.9);
}
ul { list-style: none; padding: 0; }
li { padding: 8px 0; border-bottom: 1px dashed #eee; }
.log-time {
  color: #666;
  font-size: 12px;
  margin-right: 10px;
  display: inline-block;
  width: 80px;
}
.log-message { display: inline-block; }
</style>