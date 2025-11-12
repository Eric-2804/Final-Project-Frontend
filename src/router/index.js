import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

// vistas generales
import login from '../views/login.vue'
import Home from '../views/home.vue'


// vistas del acudiente 
import ProfileViews from '../views/guardianViews/profileViews.vue'
import AttendancePage from '../views/guardianViews/AttendancePage.vue'
import DashboardGuardian from '../views/guardianViews/DashboardGuardianView.vue'
import DashboardPage from '../views/guardianViews/DashboardPage.vue'
import EnrollmentsDetailsView from '../views/guardianViews/EnrollmentsDetailsView.vue'
import EnrollmentsFormView from '../views/guardianViews/EnrollmentsFormView.vue'
import EnrollmentsView from '../views/guardianViews/EnrollmentsView.vue'
import GradesView from '../views/guardianViews/GradesView.vue'
import TeacherView from '../views/guardianViews/TeacherView.vue'

// vistas del coordinador
import dashboard from '../views/coordinatorViews/dashboardView.vue'
import generalAcademic from '../views/coordinatorViews/generalAcademicManagementView.vue'
import groupManagement from '../views/coordinatorViews/groupManagementView.vue'
import indicatorsCoordinator from '../views/coordinatorViews/indicatorsAndStatisticsView.vue'
import institutionalReports from '../views/coordinatorViews/institutionalReportsView.vue'
import pressReleases from '../views/coordinatorViews/pressReleasesView.vue'
import registrations from '../views/coordinatorViews/registrationsView.vue'
import teacherMonitoring from '../views/coordinatorViews/teacherMonitoringView.vue'

// vistas del profesor
import DashboardView from '../views/teacher/DashboardView.vue'
import ProfileView from '../views/teacher/ProfileView.vue'
import GroupsAndSubjectsView from '../views/teacher/GroupsAndSubjectsView.vue'
import AcademicManagementView from '../views/teacher/AcademicManagementView.vue'
import PerformanceIndicatorsView from '../views/teacher/PerformanceIndicatorsView.vue'
import GroupReportsView from '../views/teacher/GroupReportsView.vue'
import CommunicationsView from '../views/teacher/CommunicationsView.vue'


const routes = [
  // rutas generales
  { path: '/', name: 'login', component: login },
  { path: '/home', name: 'home', component: Home },


// rutas del acudiente
  { path: '/guardianProfile', name: 'GuardianProfile', component: ProfileViews },
  { path: '/DashboardGuardian', name: 'DashboardGuardian', component: DashboardGuardian },
  { path: '/DashboardPage', name: 'DashboardPage', component: DashboardPage},
  { path: '/AttendancePage', name: 'AttendancePage', component: AttendancePage},
  { path: '/EnrollmentsDetailsView', name: 'EnrollmentsDetailsView', component: EnrollmentsDetailsView},
  { path: '/EnrollmentsFormView', name: 'EnrollmentsFormView', component: EnrollmentsFormView},
  { path: '/EnrollmentsView', name: 'EnrollmentsView', component: EnrollmentsView},
  { path: '/GradesView', name: 'GradesView', component: GradesView},
  { path: '/TeacherView', name: 'TeacherView', component: TeacherView},

// rutas del coordinador
  { path: '/dashboardCoordinator', name: 'DashboardCoordinador', component: dashboard },
  { path: '/generalAcademicCoordinator', name: 'GeneralAcademic', component: generalAcademic },
  { path: '/groupManagementCoordinator', name: 'GroupManagement', component: groupManagement },
  { path: '/indicatorsCoordinator', name: 'IndicatorsCoordinator', component: indicatorsCoordinator },
  { path: '/institutionalReportsCoordinator', name: 'InstitutionalReports', component: institutionalReports },
  { path: '/pressReleasesCoordinator', name: 'PressReleases', component: pressReleases },
  { path: '/registrationsCoordinator', name: 'Registrations', component: registrations },
  { path: '/teacherMonitoringCoordinator', name: 'TeacherMonitoring', component: teacherMonitoring },



  // rutas del profesor 
  { path: '/teacherDashboard', name: 'TeacherDashboard', component: DashboardView },
  { path: '/teacherProfile', name: 'TeacherProfile', component: ProfileView },
  { path: '/teacherGroups', name: 'TeacherGroupsAndSubjects', component: GroupsAndSubjectsView },
  { path: '/teacherAcademicManagement', name: 'AcademicManagement', component: AcademicManagementView },
  { path: '/teacherPerformanceIndicators', name: 'PerformanceIndicators', component: PerformanceIndicatorsView },
  { path: '/teacherGroupReports', name: 'GroupReports', component: GroupReportsView },
  { path: '/teacherCommunications', name: 'TeacherCommunications', component: CommunicationsView },


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // const auth = useAuthStore()
  next()
})

export default router
