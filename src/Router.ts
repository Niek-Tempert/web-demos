import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/views/HomeView.vue'
import RustDemo from './components/views/RustDemo.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/rust', component: RustDemo, meta: { noLayout: true }},
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router