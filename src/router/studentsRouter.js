import perfilEstudiante from "../views/students/perfilStudent.vue"
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import DashboardStudent from '../views/students/dashboardStudent.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'DashboardStudent',
    component: DashboardStudent,
    meta: { requiresAuth: true }
  },
  {

  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
