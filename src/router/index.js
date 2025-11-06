import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import vista from '../views/vista.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
   {
    path: '/vista',
    name: 'vista',
    component: vista
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
