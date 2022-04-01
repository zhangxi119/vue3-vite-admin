import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import ElementPlus from 'element-plus'
// import ECharts from 'vue-echarts'
// import { use } from "echarts/core";
import "echarts";
import './style/reset.scss'
import './style/table.scss'

const app = createApp(App)
// app.component('v-chart', ECharts)
app.use(ElementPlus, { size: 'small', zIndex: 3000 }).use(router).use(store).mount('#app')
