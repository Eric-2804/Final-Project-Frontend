import MainLayout from '../layouts/MainLayout.vue';
import DashboardView from '../views/teacher/DashboardView.vue';
import ProfileView from '../views/teacher/ProfileView.vue';
import GroupsAndSubjectsView from '../views/teacher/GroupsAndSubjectsView.vue';
import AcademicManagementView from '../views/teacher/AcademicManagementView.vue';
import PerformanceIndicatorsView from '../views/teacher/PerformanceIndicatorsView.vue';
import GroupReportsView from '../views/teacher/GroupReportsView.vue';
import CommunicationsView from '../views/teacher/CommunicationsView.vue';

const teacherRoutes = [
  {
    path: '/teacher',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: DashboardView
      },
      {
  path: 'profile',
  name: 'TeacherProfile',
  component: ProfileView
},
      {
        path: 'groups',
        name: 'TeacherGroupsAndSubjects',
        component: GroupsAndSubjectsView
      },
      {
        path: 'academic-management/:groupId',
        name: 'AcademicManagement',
        component: AcademicManagementView,
        props: true
      },
      {
        path: 'performance-indicators',
        name: 'PerformanceIndicators',
        component: PerformanceIndicatorsView
      },
      {
        path: 'group-reports',
        name: 'GroupReports',
        component: GroupReportsView
      },
      {
        path: 'communications',
        name: 'TeacherCommunications',
        component: CommunicationsView
      }
    ]
  }
];

export default teacherRoutes;