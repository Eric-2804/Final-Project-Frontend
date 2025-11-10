import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

/* Vistas principales */
const Home = () => import('@/views/home.vue')
const Login = () => import('@/views/login.vue')
const Dashboard = () => import('@/views/dashboard.vue')
const Grades = () => import('@/views/GradesView.vue')
const Attendance = () => import('@/views/AttendancePage.vue')
const TeachersManagement = () => import('@/views/TeachersManagementView.vue')
const EnrollmentManagement = () => import('@/views/EnrollmentManagementView.vue')
const EnrollmentForm = () => import('@/views/EnrollmentFormView.vue')
const EnrollmentDetails = () => import('@/views/EnrollmentDetailsView.vue')

import { useAuthStore } from '@/store/authStore'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'dashboard-acudiente', name: 'dashboardAcudiente', component: () => import('@/views/DashboardAcudienteView.vue') },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'grades', name: 'grades', component: Grades },
      { path: 'attendance', name: 'attendance', component: Attendance },
      { path: 'profesores', name: 'teachers', component: TeachersManagement },
      { path: 'matriculas', name: 'matriculas', component: EnrollmentManagement },
      { path: 'matriculas/nueva', name: 'formularioMatricula', component: EnrollmentForm },
      { path: 'matriculas/:id', name: 'detallesMatricula', component: EnrollmentDetails, props: true }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
