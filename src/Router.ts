import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/views/HomeView.vue'
import Rust from './components/views/Rust.vue'
import NotFound from './components/views/NotFound.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/rust', component: Rust, meta: { noLayout: true }},
  { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router