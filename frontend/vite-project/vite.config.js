import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    },
    headers: {
      // 确保MP3文件能被正确识别
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    }
  },
  // 添加静态资源处理
  define: {
    'process.env': {}
  },
  // 确保MP3文件被正确处理
  optimizeDeps: {
    include: []
  }
})
