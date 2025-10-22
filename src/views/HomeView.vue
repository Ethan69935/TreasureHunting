<template>
  <div class="home-container">
    <div class="header-bar">
      <h1 class="page-title">宝藏猎人冒险</h1>
      <div class="user-actions">
        <span v-if="userStore.isLogin">欢迎，{{ userStore.username }}！</span>
        <el-button 
          v-if="userStore.isLogin" 
          type="warning" 
          size="small" 
          @click="resetGame"
        >
          重新开始
        </el-button>
        <el-button 
          v-if="userStore.isLogin" 
          type="text" 
          @click="handleLogout"
        >
          退出登录
        </el-button>
        <el-button 
          v-else 
          type="text" 
          @click="goToLogin"
        >
          登录/注册
        </el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="goToRanking"
          :disabled="!userStore.isLogin"
        >
          排行榜
        </el-button>
      </div>
    </div>

    <StatusPanel 
      v-if="userStore.isLogin"
      :gold="gameStore.gameState.gold"
      :helpers="gameStore.gameState.helpers"
      :hasClue="gameStore.gameState.hasClue"
      :hasTreasure="gameStore.gameState.hasTreasure"
    />
    
    <div v-if="!userStore.isLogin" class="login-prompt">
      <el-card>
        <p>请先登录，开始你的寻宝冒险！</p>
        <el-button type="primary" @click="goToLogin">立即登录</el-button>
      </el-card>
    </div>
    
    <div v-else class="scene-grid">
      <SceneCard 
        v-for="scene in gameStore.accessibleScenes" 
        :key="scene.id"
        :name="scene.name"
        :bg="`${scene.id}-bg.png`"
        :description="getSceneDescription(scene.id)"
        :scene-id="scene.id"
        :is-unlocked="true"
        :is-completed="scene.completed"
        @enter="enterScene"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import SceneCard from '@/components/common/SceneCard.vue';
import StatusPanel from '@/components/common/StatusPanel.vue';
import { onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

onMounted(() => {
  userStore.loadUsers();
  if (userStore.isLogin) {
    gameStore.initGame();
  }
});

watch(
  () => userStore.isLogin,
  (newVal) => {
    if (newVal) {
      gameStore.initGame();
    }
  }
);

const enterScene = (sceneId) => {
  router.push(`/scene/${sceneId}`);
};

const handleLogout = () => {
  userStore.logout();
  gameStore.resetGame();
  router.push('/login');
};

const goToLogin = () => {
  router.push('/login');
};

const goToRanking = () => {
  router.push('/ranking');
};

const resetGame = () => {
  if (confirm('确定要重新开始游戏吗？当前进度将被清空！')) {
    gameStore.resetGame();
    ElMessage.success('已重置游戏，开始新的冒险吧！');
  }
};

const getSceneDescription = (sceneId) => {
  const descriptions = {
    village: '宁静的村庄，藏有古老地图',
    library: '古老图书馆，有珍贵古籍',
    tavern: '猎人聚集处，可雇佣帮手',
    temple: '神秘神庙，守卫森严',
    cave: '黑暗洞穴，充满未知危险',
    treasureRoom: '传说中的宝藏所在地',
    exit: '冒险结束，结算奖励'
  };
  return descriptions[sceneId] || '未知场景';
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-image: url('@/assets/images/Main Interface.png');
  background-size: cover;
  background-position: center;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  color: #333;
  font-size: 24px;
  margin: 0;
  padding: 10px 0;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 30px;
  justify-items: center;
}

.login-prompt {
  margin-top: 30px;
  text-align: center;
}

.login-prompt .el-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
}
</style>