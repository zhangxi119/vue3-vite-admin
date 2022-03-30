import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import './style/reset.scss'
import './style/table.scss'
createApp(App).use(ElementPlus, { size: 'small', zIndex: 3000 }).use(router).mount('#app')
