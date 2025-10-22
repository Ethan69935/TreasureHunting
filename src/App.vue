<template>
  <el-container class="app-container" style="min-height: 100vh;">
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
/* 使用scoped避免影响子组件 */
.app-container {
  width: 100%;
  box-sizing: border-box;
}

/* 穿透修改全局body样式，确保页面占满全屏 */
::v-deep body {
  margin: 0;
  min-height: 100vh;
  padding: 0;
  box-sizing: border-box;
}
</style>