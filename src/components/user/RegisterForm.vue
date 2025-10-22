<template>
  <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleRegister">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { ElMessage } from 'element-plus';
import { defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['register-success']);
const userStore = useUserStore();
const router = useRouter();
const registerFormRef = ref(null);

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
});

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate();
    const result = userStore.register(registerForm.value.username, registerForm.value.password);
    
    if (result.success) {
      ElMessage.success(result.message);
      emit('register-success');
        // 自动登录并跳转到主页：如果登录成功则 push('/')
        const loginResult = userStore.login(registerForm.value.username, registerForm.value.password);
        if (loginResult.success) {
          // 使用 router 跳转，捕获重复导航错误并忽略
          router.push('/').catch(err => {
            if (!err || !err.message || !err.message.includes('Avoided redundant navigation')) {
              console.error('导航到主页失败:', err);
            }
          });
        }
      // 重置表单
      registerFormRef.value.resetFields();
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    console.log('表单验证失败:', error);
  }
};
</script>