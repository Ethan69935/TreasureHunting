<template>
  <div class="ranking-container">
    <el-table :data="userStore.rankings" border style="width: 100%">
      <el-table-column type="index" label="排名" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="score" label="最终得分"></el-table-column>
      <el-table-column prop="time" label="完成时间"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
userStore.loadRankings();
</script>

<style scoped>
.ranking-container { max-width: 800px; margin: 20px auto; }
</style>