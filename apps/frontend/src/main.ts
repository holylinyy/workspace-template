import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './fetch'
import 'virtual:uno.css'
createApp(App).use(Antd).mount('#app')
