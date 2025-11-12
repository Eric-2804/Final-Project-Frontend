import { createRouter, createWebHistory } from 'vue-router'
import dashboard from '../views/coordinatorViews/dashboardView.vue'
import generalAcademic from '../views/coordinatorViews/generalAcademicManagementView.vue'
import groupManagement from '../views/coordinatorViews/groupManagementView.vue'
import indicatorsCoordinator from '../views/coordinatorViews/indicatorsAndStatisticsView.vue'
import institutionalReports from '../views/coordinatorViews/institutionalReportsView.vue'
import pressReleases from '../views/coordinatorViews/pressReleasesView.vue'
import registrations from '../views/coordinatorViews/registrationsView.vue'
import teacherMonitoring from '../views/coordinatorViews/teacherMonitoringView.vue'


const routes_coordinator = [

    {path : '/dashboardCoordinator', name: 'DashboardCoordinador', component: dashboard},
    {path : '/generalAcademicCoordinator', name : 'GeneralAcademic', component: generalAcademic},
    {path : '/groupManagementCoordinator', name : 'GroupManagement', component: groupManagement},
    {path : '/indicatorsCoordinator', name : 'indicatorsCoordinator', component: indicatorsCoordinator},
    {path : '/institutionalReportsCoordinator', name : 'institutionalReports', component: institutionalReports},
    {path : '/pressReleasesCoordinator', name : 'pressReleases', component: pressReleases},
    {path : '/registrationsCoordinator', name: registrations, component: registrations },
    {path : '/teacherMonitoringCoordinator', name: teacherMonitoring, component: teacherMonitoring}
    
    ]

    const router = createRouter({
        history: createWebHistory(),
        routes: [
        ...routes_coordinator
        ]
    })

    export default router
