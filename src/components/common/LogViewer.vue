<template>
  <el-card class="log-card">
    <h4>冒险日志</h4>
    <ul v-if="logs && logs.length">
      <li v-for="(log, idx) in logs" :key="idx" :class="`log-${log.type || 'info'}`">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-message">{{ log.message }}</span>
      </li>
    </ul>
    <div v-else class="no-logs">暂无日志</div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  logs: { type: Array, default: () => [] }
});
</script>

<style scoped>
.log-card { max-height: 300px; overflow-y: auto; background-color: rgba(255,255,255,0.9); }
.log-time { color: #666; font-size: 12px; margin-right: 10px; display:inline-block; width:120px }
.log-message { display:inline-block }
.log-success .log-message { color: #52c41a }
.log-warning .log-message { color: #faad14 }
.no-logs { color:#999; padding:10px }
</style>