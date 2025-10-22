<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <div class="tabs-container">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="登录" name="login">
            <!-- 监听登录成功事件，直接调用路由跳转 -->
            <login-form @login-success="goToHome" />
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <register-form @register-success="handleRegisterSuccess" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '@/components/user/LoginForm.vue';
import RegisterForm from '@/components/user/RegisterForm.vue';

const router = useRouter();
const activeTab = ref('login');

// 关键修复：直接使用路由跳转，不依赖其他逻辑
const goToHome = () => {
  router.push('/').catch(err => {
    // 忽略导航重复的错误
    if (!err.message.includes('Avoided redundant navigation')) {
      console.error('跳转失败:', err);
    }
  });
};

const handleRegisterSuccess = () => {
  activeTab.value = 'login';
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}
.auth-card {
  width: 400px;
  padding: 20px;
}
.tabs-container {
  margin-top: 20px;
}
</style>