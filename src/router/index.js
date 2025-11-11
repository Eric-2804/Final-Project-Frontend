import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import groupManagementView from '../views/coordinatorViews/groupManagementView.vue'
import registrationsView from '../views/coordinatorViews/registrationsView.vue'
import pressReleasesView from '../views/coordinatorViews/pressReleasesView.vue'
import teacherMonitoringView from '../views/coordinatorViews/teacherMonitoringView.vue'

const routes = [
  { path: '/', name: 'login', component: login },
  { path: '/dashboard', name: 'home', component: home },
  
  // Rutas Coordinador
  {
    path: '/coordinator',
    children: [
      { path: 'group-management', name: 'groupManagement', component: groupManagementView },
      { path: 'registrations', name: 'registrations', component: registrationsView },
      { path: 'press-releases', name: 'pressReleases', component: pressReleasesView },
      { path: 'teacher-monitoring', name: 'teacherMonitoring', component: teacherMonitoringView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
