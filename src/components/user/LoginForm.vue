<template>
  <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useGameStore } from '@/stores/gameStore';
import { ElMessage } from 'element-plus';
import { defineEmits } from 'vue';

// 定义触发父组件的事件
const emit = defineEmits(['login-success']);
const userStore = useUserStore();
const gameStore = useGameStore();
const loginFormRef = ref(null);

const loginForm = ref({
  username: '',
  password: ''
});

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});

const handleLogin = async () => {
  try {
    // 验证表单
    await loginFormRef.value.validate();
    // 调用登录方法
    const result = userStore.login(loginForm.value.username, loginForm.value.password);
    
    if (result.success) {
      ElMessage.success(result.message);
      // 初始化游戏数据
      gameStore.initGame();
      // 关键修复：强制触发父组件的跳转事件
      emit('login-success');
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    console.log('表单验证失败:', error);
  }
};
</script>