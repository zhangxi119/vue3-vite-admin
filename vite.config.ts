import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from "vite-plugin-mock"
import legacy from '@vitejs/plugin-legacy'
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'
// // https://vitejs.dev/config/
// import path from 'path'
const resolve = (dir: string): string => path.resolve(__dirname, dir)
// console.log(import.meta, '---------import.meta.env');
// const IS_DEV = import.meta.env.MODE === 'development' ? true : false

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
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
  ],

  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: '/',
  /**
  * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
  * @default 'dist'
  */
  // outDir: 'dist',
  build: {
    target: 'modules',
    outDir: 'dist', // 指定输出路径
    assetsDir: 'static', // 指定生成静态资源的存放路径
    minify: 'terser', // 混淆器,terser构建后文件体积更小
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true // 生产环境移除debugger
      }
    },
    rollupOptions: {
      treeshake: false,
      output: {
        manualChunks (id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
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
        target: 'http://localhost:3000/',
        changeOrigin: true,
        ws: true,
        rewrite: (pathStr) => pathStr.replace('/api', '')
      },
    },
  },
  resolve: {
    // 导入文件夹别名
    alias: {
      // 兼容webpack的习惯
      '@': resolve('src'),
      '@img': resolve('src/assets/img'),
      '@less': resolve('src/assets/less'),
      '@libs': resolve('src/libs'),
      '@cp': resolve('src/components'),
      '@views': resolve('src/views'),
      // 兼容webpack的静态资源
      '~@': resolve('src'),
      '~@img': resolve('src/assets/img'),
      '~@less': resolve('src/assets/less'),
      '~@libs': resolve('src/libs'),
      '~@cp': resolve('src/components'),
      '~@views': resolve('src/views'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 引入 .scss 这样就可以在全局中使用 variable.scss中预定义的变量了
        // 给导入的路径最后加上 ; 双引号中间是文件地址对应好自己项目的路径就行
        additionalData: '@import "./src/style/common.scss";'
      }
    },
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: 'px', // 需要转换的单位，默认为"px"
          viewportWidth: 1920, // 设计稿的视口宽度
          unitPrecision: 5, // 单位转换后保留的精度
          // propList: ['*','!font-size'], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
          propList: ['*'], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
          viewportUnit: 'vw', // 希望使用的视口单位
          fontViewportUnit: 'vw', // 字体使用的视口单位
          // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
          // 下面配置表示类名中含有'keep-px'都不会被转换
          selectorBlackList: ['keep-px'],
          minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
          mediaQuery: false, // 媒体查询里的单位是否需要转换单位
          replace: true, //  是否直接更换属性值，而不添加备用属性
          exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
          landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
          landscapeUnit: 'vw', // 横屏时使用的单位
          landscapeWidth: 1338, // 横屏时使用的视口宽度
        })
      ]
    },
  }
})