import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
import router from './router'
import './permission'
import ElementPlus from 'element-plus'
// Echarts组件自行在单文件组件中引用，此处注释掉全局引用
// import ECharts from 'vue-echarts'
import { use } from "echarts/core";
// import "echarts";
// 手动引入 ECharts 各模块来减小打包体积
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  MapChart,
  LineChart
} from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'

// 国际化语言
import i18n from './i18n'

use([
  // 渲染系列组件
  CanvasRenderer,
  // 基础组件
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  // 类型组件
  BarChart,
  MapChart,
  LineChart,
]);
// 公用样式
import './style/reset.scss'
import './style/table.scss'

const app = createApp(App)
// app.component('v-chart', ECharts)
app.use(ElementPlus, { size: 'small', zIndex: 3000 }).use(store).use(router).use(i18n).mount('#app')
