import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import RegisterView from '../views/RegisterView.vue'

// vistas generales
import login from '../views/login.vue'
import Home from '../views/home.vue'

// vistas del acudiente
import ProfileViews from '../views/guardianViews/profileViews.vue'
import AttendancePage from '../views/guardianViews/AttendancePage.vue'
import DashboardGuardian from '../views/guardianViews/DashboardGuardianView.vue'
import EnrollmentsDetailsView from '../views/guardianViews/EnrollmentsDetailsView.vue'
import EnrollmentsFormView from '../views/guardianViews/EnrollmentsFormView.vue'
import EnrollmentsView from '../views/guardianViews/EnrollmentsView.vue'
import GradesView from '../views/guardianViews/GradesView.vue'
import TeacherView from '../views/guardianViews/TeacherView.vue'
import StudentInfoView from '../views/guardianViews/StudentInfoView.vue'
import AcademicLoad from '../views/guardianViews/AcademicLoad.vue'

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
import TeacherDashboardView from '@/views/teacher/DashboardView.vue'
import TeacherProfileView from '@/views/teacher/ProfileView.vue'
import TeacherGroupsAndSubjectsView from '@/views/teacher/GroupsAndSubjectsView.vue'
import AcademicManagementView from '@/views/teacher/AcademicManagementView.vue'
import PerformanceIndicatorsView from '@/views/teacher/PerformanceIndicatorsView.vue'
import GroupReportsView from '@/views/teacher/GroupReportsView.vue'
import CommunicationsView from '@/views/teacher/CommunicationsView.vue'

// vistas del estudiante
import DashboardStudent from '../views/students/dashboardStudent.vue'
import PerfilStudent from '../views/students/perfilStudent.vue'

// vistas de la secretaria
import SedesSecretaria from '../views/secretaria/headquartersSecretariat.vue'
import DashboardSecretaria from '../views/secretaria/DashboardSecretaria.vue'

const routes = [
  // rutas públicas → sin layout
  { path: '/', name: 'login', component: login },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/home', name: 'home', component: Home },

  // rutas internas → con MainLayout
  {
    path: '/',
    component: MainLayout,
    children: [
      // ✅ REDIRECT para que /management lleve a una página por defecto
      { path: '/management', name: 'Management', redirect: '/management/usuarios-colegio' },

      // acudiente
      { path: 'guardian/profile', name: 'GuardianProfile', component: ProfileViews },
      { path: 'guardian/communications', name: 'GuardianCommunications', component: () => import('../views/guardianViews/Communications.vue') },
      { path: 'DashboardGuardian', name: 'DashboardGuardian', component: DashboardGuardian },
      { path: 'AttendancePage', name: 'AttendancePage', component: AttendancePage },
      { path: 'EnrollmentsDetailsView/:id', name: 'EnrollmentsDetailsView', component: EnrollmentsDetailsView },
      { path: 'EnrollmentsFormView', name: 'EnrollmentsFormView', component: EnrollmentsFormView },
      { path: 'EnrollmentsView', name: 'EnrollmentsView', component: EnrollmentsView },
      { path: 'GradesView', name: 'GradesView', component: GradesView },
      { path: 'TeacherView', name: 'TeacherView', component: TeacherView },
      { path: 'StudentInfoView', name: 'StudentInfoView', component: StudentInfoView },
      { path: 'AcademicLoad', name: 'AcademicLoad', component: AcademicLoad },

      // coordinador
      { path: 'coordinator/profile', name: 'CoordinatorProfile', component: () => import('../views/coordinatorViews/Profile.vue') },
      { path: 'coordinator/communications', name: 'CoordinatorCommunications', component: () => import('../views/coordinatorViews/Communications.vue') },
      { path: 'dashboardCoordinator', name: 'DashboardCoordinador', component: dashboard },
      { path: 'generalAcademicCoordinator', name: 'GeneralAcademic', component: generalAcademic },
      { path: 'groupManagementCoordinator', name: 'GroupManagement', component: groupManagement },
      { path: 'indicatorsCoordinator', name: 'IndicatorsCoordinator', component: indicatorsCoordinator },
      { path: 'institutionalReportsCoordinator', name: 'InstitutionalReports', component: institutionalReports },
      { path: 'pressReleasesCoordinator', name: 'PressReleases', component: pressReleases },
      { path: 'registrationsCoordinator', name: 'Registrations', component: registrations },
      { path: 'teacherMonitoringCoordinator', name: 'TeacherMonitoring', component: teacherMonitoring },

      // profesor
      { path: 'teacher/dashboard', name: 'TeacherDashboard', component: TeacherDashboardView },
      { path: 'teacher/profile', name: 'TeacherProfile', component: TeacherProfileView },
      { path: 'teacher/groups', name: 'TeacherGroupsAndSubjects', component: TeacherGroupsAndSubjectsView },
      { path: 'teacher/academic-management', name: 'AcademicManagement', component: AcademicManagementView },
      { path: 'teacher/performance-indicators', name: 'PerformanceIndicators', component: PerformanceIndicatorsView },
      { path: 'teacher/group-reports', name: 'GroupReports', component: GroupReportsView },
      { path: 'teacher/communications', name: 'TeacherCommunications', component: CommunicationsView },

      // estudiante
      { path: 'student/dashboard', name: 'dashboardStudents', component: DashboardStudent },
      { path: 'student/profile', name: 'perfilStudents', component: PerfilStudent },
      { path: 'student/communications', name: 'StudentCommunications', component: () => import('../views/students/Communications.vue') },

      // secretaria
      { path: 'secretaria/dashboard', name: 'SecretariaDashboard', component: DashboardSecretaria },
      { path: 'secretaria/headquarters', name: 'sedes_Secretaria', component: SedesSecretaria },
      { path: 'secretaria/profile', name: 'SecretariaProfile', component: () => import('../views/secretaria/Profile.vue') },
      { path: 'secretaria/matriculas', name: 'SecretariaMatriculas', component: () => import('../views/secretaria/Matriculas.vue') },

      // rector
      { path: 'rector/dashboard', name: 'DashboardRector', component: () => import('../views/rector/DashboardRector.vue') },
      { path: 'rector/direccion-nucleo', name: 'DireccionNucleo', component: () => import('../views/rector/DireccionNucleo.vue') },
      { path: 'rector/colegios', name: 'Colegios', component: () => import('../views/rector/Colegios.vue') },
      { path: 'rector/sedes', name: 'Sedes', component: () => import('../views/rector/Sedes.vue') },
      { path: 'rector/matriculas', name: 'Matriculas', component: () => import('../views/rector/Matriculas.vue') },
      { path: 'rector/estructura-academica', name: 'EstructuraAcademica', component: () => import('../views/rector/EstructuraAcademica.vue') },
      { path: 'rector/asignacion-docente', name: 'AsignacionDocente', component: () => import('../views/rector/AsignacionDocente.vue') },
      { path: 'rector/profile', name: 'ProfileRector', component: () => import('../views/rector/ProfileRector.vue') },
      { path: 'rector/communications', name: 'RectorCommunications', component: () => import('../views/rector/Communications.vue') },

      // management
      { path: 'management/vigencia', name: 'Vigencia', component: () => import('../views/management/VigenciaView.vue') },
      { path: 'management/periodo', name: 'Periodo', component: () => import('../views/management/PeriodoView.vue') },
      { path: 'management/materia-area', name: 'MateriaArea', component: () => import('../views/management/MateriaAreaView.vue') },
      { path: 'management/grupo', name: 'Grupo', component: () => import('../views/management/GrupoView.vue') },
      { path: 'management/parametros', name: 'Parametros', component: () => import('../views/management/ParametrosView.vue') },
      { path: 'management/indicadores', name: 'Indicadores', component: () => import('../views/management/IndicadoresView.vue') },
      { path: 'management/matricula', name: 'Matricula', component: () => import('../views/management/MatriculaView.vue') },
      { path: 'management/carga-academica', name: 'CargaAcademica', component: () => import('../views/management/CargaAcademicaView.vue') },
      { path: 'management/calificacion', name: 'Calificacion', component: () => import('../views/management/CalificacionView.vue') },
      { path: 'management/usuarios-colegio', name: 'UsuariosColegio', component: () => import('../views/management/UsuariosColegioView.vue') }
    ]
  }
]

import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const isAuthenticated = authStore.isAuthenticated;
  const publicPages = ['/', '/login', '/register'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !isAuthenticated) {
    return next('/');
  }

  if (to.path === '/home' && isAuthenticated) {
    const userRole = authStore.user?.rol; // Usar el rol normalizado del store
    if (userRole) {
      // ✅ Lógica de redirección consistente
      const roleRoutes = {
        administrador: '/management',
        rector: '/rector/dashboard',
        coordinador: '/dashboardCoordinator',
        secretaria: '/secretaria/dashboard',
        profesor: '/teacher/dashboard',
        acudiente: '/DashboardGuardian',
        estudiante: '/student/dashboard'
      };
      const redirectPath = roleRoutes[userRole] || '/';
      return next(redirectPath);
    } else {
      return next('/');
    }
  }

  next();
});

export default router