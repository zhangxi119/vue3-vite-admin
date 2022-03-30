import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from "vite-plugin-mock"
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// })

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteMockServe({
      supportTs: false,
    }),
  //   styleImport({
  //     libs: [
  //       {
  //         libraryName: 'element-plus',
  //         esModule: true,
  //         ensureStyleFile: true,
  //         resolveStyle: (name) => {
  //           return `element-plus/lib/theme-chalk/${name}.css`;
  //         },
  //         resolveComponent: (name) => {
  //           return `element-plus/lib/${name}`;
  //         },
  //       }
  //     ]
  //   })
  ],

  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: './',
  /**
  * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
  * @default 'dist'
  */
  outDir: 'dist',
  server: {
    // hostname: '0.0.0.0',
    host: "localhost",
    port: 3000,
    // // 是否自动在浏览器打开
    // open: true,
    // // 是否开启 https
    // https: false,
    // // 服务端渲染
    // ssr: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3333/',
        changeOrigin: true,
        ws: true,
        rewrite: (pathStr) => pathStr.replace('/api', '')
      },
    },
  },
  resolve: {
    // 导入文件夹别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      views: path.resolve(__dirname, './src/views'),
      components: path.resolve(__dirname, './src/components'),
      utils: path.resolve(__dirname, './src/utils'),
      less: path.resolve(__dirname, "./src/less"),
      assets: path.resolve(__dirname, "./src/assets"),
      com: path.resolve(__dirname, "./src/components"),
      store: path.resolve(__dirname, "./src/store"),
      mixins: path.resolve(__dirname, "./src/mixins"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 引入 .scss 这样就可以在全局中使用 variable.scss中预定义的变量了
        // 给导入的路径最后加上 ; 双引号中间是文件地址对应好自己项目的路径就行
        additionalData: '@import "./src/style/common.scss";'
      }
    }
  }
})