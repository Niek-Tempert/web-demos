import { createApp } from 'vue'
import './style.css'
import Router from './Router.ts'
import App from './App.vue'

createApp(App).use(Router).mount('#app')
