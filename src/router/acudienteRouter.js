import { createRouter, createWebHistory } from 'vue-router'
import profileAcudiente from '../views/acudienteViews/profileView.vue'

const routes_acudiente = [
  {
    path: '/Acudiente/Profile',
    name: 'AcudienteProfile',
    component: profileAcudiente
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes_acudiente
})

export default router   // ✅ importante
