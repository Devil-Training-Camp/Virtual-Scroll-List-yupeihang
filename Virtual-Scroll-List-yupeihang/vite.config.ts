import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'; // 免引入插件
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
        /\.md$/,
      ],
      imports: [
        // 插件预设支持导入的api
        'vue',
        'vue-router',
      ]
    })
  ],
  lintOnSave: true
})
