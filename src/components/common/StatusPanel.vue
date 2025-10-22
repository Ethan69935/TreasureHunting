<template>
  <el-card class="status-panel">
    <div class="status-item">金币: {{ gold }}</div>
    <div class="status-item">打手: {{ helpers }}人</div>
    <div class="status-item">线索: {{ hasClue ? '已找到' : '未找到' }}</div>
    <div class="status-item">宝藏: {{ hasTreasure ? '已找到' : '未找到' }}</div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps([
  'gold',
  'helpers',
  'hasClue',
  'hasTreasure'
]);
</script>

<style scoped>
.status-panel {
  background-color: rgba(255, 255, 255, 0.8) !important;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.status-item {
  margin: 8px 0;
  font-size: 16px;
  color: #333;
}
</style>