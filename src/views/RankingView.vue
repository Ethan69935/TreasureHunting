<template>
  <div class="ranking-container">
    <el-page-header @back="handleBack" content="寻宝排行榜"></el-page-header>
    
    <RankingList />
    
    <el-button class="back-btn" @click="handleBack">返回地图</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import RankingList from '@/components/user/RankingList.vue';

const router = useRouter();

const handleBack = () => {
  router.push('/');
};
</script>

<style scoped>
.ranking-container { max-width: 800px; margin: 0 auto; padding: 20px; }
.back-btn { margin-top: 20px; }
</style>