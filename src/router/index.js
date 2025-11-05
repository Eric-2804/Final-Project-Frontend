import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import vista from '../views/vista.vue'
import modal from '../views/modal.vue'
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
  },
  {
    path: '/modal',
    name: 'modal',
    component: modal
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
