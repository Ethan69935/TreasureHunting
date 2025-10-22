import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isLogin: false,
    registeredUsers: {}, // 存储所有用户
    _initialized: false // 初始化标记
  }),

  actions: {
    // 加载用户数据（同步操作，确保路由守卫能立即获取状态）
    loadUsers() {
      try {
        const usersStr = localStorage.getItem('registeredUsers');
        if (usersStr) {
          this.registeredUsers = JSON.parse(usersStr);
        }
        
        // 加载当前登录状态
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          this.username = currentUser;
          this.isLogin = true;
        }
      } catch (error) {
        console.error('加载用户数据失败:', error);
        localStorage.removeItem('registeredUsers');
        localStorage.removeItem('currentUser');
      }
    },

    // 注册
    register(username, password) {
      if (this.registeredUsers[username]) {
        return { success: false, message: '用户名已存在' };
      }
      if (username.length < 3) {
        return { success: false, message: '用户名至少3个字符' };
      }
      if (password.length < 6) {
        return { success: false, message: '密码至少6个字符' };
      }

      this.registeredUsers[username] = password;
      localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsers));
      return { success: true, message: '注册成功，请登录' };
    },

    // 登录（返回登录状态，确保同步）
    login(username, password) {
      if (this.registeredUsers[username] === password) {
        this.username = username;
        this.isLogin = true;
        localStorage.setItem('currentUser', username); // 保存登录状态
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '用户名或密码错误' };
    },

    // 登出
    logout() {
      this.username = '';
      this.isLogin = false;
      localStorage.removeItem('currentUser');
    },

    // 添加分数到排行榜
    addScore(score) {
      try {
        const rankingStr = localStorage.getItem('gameRanking') || '[]';
        const ranking = JSON.parse(rankingStr);
        
        ranking.push({
          username: this.username,
          score,
          time: new Date().toLocaleString()
        });
        
        // 按分数排序，保留前10名
        ranking.sort((a, b) => b.score - a.score);
        if (ranking.length > 10) ranking.splice(10);
        
        localStorage.setItem('gameRanking', JSON.stringify(ranking));
        return { success: true };
      } catch (error) {
        console.error('保存成绩失败:', error);
        return { success: false, message: '保存成绩失败' };
      }
    }
  }
});