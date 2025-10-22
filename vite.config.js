import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  // 必须导入path模块

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 关键：将@指向src目录（使用path.resolve确保路径正确）
      '@': path.resolve(__dirname, './src')
    }
  },
  // 解决Vue运行时编译问题
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
})