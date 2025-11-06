import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/DashboardPage.vue')
  },
  {
    path: '/teams',
    component: () => import('@/views/TeamsPage.vue')
  },
  {
    path: '/payments',
    component: () => import('@/views/PaymentsPage.vue')
  },
  {
    path: '/attendance',
    component: () => import('@/views/AttendancePage.vue')
  },
  {
    path: '/settings',
    component: () => import('@/views/SettingsPage.vue')
  },
  {
    path: '/notifications',
    component: () => import('@/views/NotificationsPage.vue')
  },
  {
    path: '/grades',
    component: () => import('@/views/GradesView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router