<template>
  <div class="scene-card" @click="$emit('enter', sceneId)">
    <!-- 场景图标 -->
    <div class="scene-icon">
      <img 
        :src="iconUrl" 
        :alt="name" 
        class="icon-img"
        @error="handleImgError"
      >
    </div>
    <!-- 场景名称 -->
    <div class="scene-name">{{ name }}</div>
    <!-- 完成状态标记 -->
    <div v-if="isCompleted" class="completed-badge">已完成</div>
    <!-- 点击提示（新增） -->
    <div class="click-hint">点击进入</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  bg: { type: String, required: true },
  description: { type: String, default: '' },
  sceneId: { type: String, required: true },
  isUnlocked: { type: Boolean, default: true },
  isCompleted: { type: Boolean, default: false }
});

const iconUrl = computed(() => {
  return new URL(`/src/assets/images/${props.bg}`, import.meta.url).href;
});

const handleImgError = (e) => {
  e.target.src = new URL('/src/assets/images/default-icon.png', import.meta.url).href;
};
</script>

<style scoped>
.scene-card {
  width: 120px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer; /* 显示手型光标，提示可点击 */
  position: relative;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.2s;
}

/* 悬停效果（新增） */
.scene-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scene-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0e6d2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  overflow: hidden;
}

.icon-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.scene-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.completed-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #4cd964;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

/* 点击提示样式（新增） */
.click-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>