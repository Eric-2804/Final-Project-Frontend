import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

// vistas generales
import login from '../views/login.vue'
import Home from '../views/home.vue'



// vistas de la secretaria
import SedesSecretaria from '../views/headquartersSecretary.vue'
import DashboardSecretaria from '../views/DashboardSecretaria.vue'
import AcademicManagementView from "../views/AcademicManagementView.vue"
import CalificacionView from "../views/CalificacionView.vue"
import EnrollmentsDetailsView from "../views/EnrollmentsDetailsView.vue"
import EnrollmentsFormView from "../views/EnrollmentsFormView.vue"
import EnrollmentsView from "../views/EnrollmentsView.vue"
import PeriodoView from "../views/PeriodoView.vue"
import Profile from "../views/Profile.vue"
import RegisterView from '../views/RegisterView.vue'

import QualificationsModule from '@/views/qualifications/QualificationsModule.vue';
import StudentGrades from '@/views/qualifications/StudentGrades.vue';
import GroupGrades from '@/views/qualifications/GroupGrades.vue';
import CreateQualification from '@/views/qualifications/CreateQualification.vue';
import BatchCreate from '@/views/qualifications/BatchCreate.vue';
import GenerateFinals from '@/views/qualifications/GenerateFinals.vue';
import FinalsByYear from '@/views/qualifications/FinalsByYear.vue';
import FinalsByGroup from '@/views/qualifications/FinalsByGroup.vue';

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


      // secretaria
      { path: 'secretaria/dashboard', name: 'SecretariaDashboard', component: DashboardSecretaria },
      { path: 'secretaria/headquarters', name: 'sedes_Secretaria', component: SedesSecretaria },
      { path: 'secretaria/academicManagement', name: "Gestion_Academica", component: AcademicManagementView },
      { path: 'secretaria/calificacion', name: "Gestion_Calificaciones", component: CalificacionView },
      { path: 'secretaria/enrollmentsDetails', name: "Detalles_Matrícula", component: EnrollmentsDetailsView},
      { path: 'secretaria/enrollmentsForm', name: "Formulario_Matrícula", component: EnrollmentsFormView},
      { path: 'secretaria/enrollments', name: "Mis_Matrícula", component: EnrollmentsView},
      { path: 'secretaria/periodo', name: "Gestion_Periodos", component: PeriodoView},
      { path: 'secretaria/profile', name: "Perfil", component: Profile},
      { path: 'secretaria/register', name: "Registro", component: RegisterView},
    
      {
        path: '/qualifications',
        component: QualificationsModule,
        meta: { requiresAuth: true, roles: ['secretaria'] },
        children: [
          { path: '', redirect: '/qualifications/student' },
          { path: 'student', component: StudentGrades },
          { path: 'group', component: GroupGrades },
          { path: 'create', component: CreateQualification },
          { path: 'batch', component: BatchCreate },
          { path: 'generate', component: GenerateFinals },
          { path: 'finals-by-year', component: FinalsByYear },
          { path: 'finals-by-group', component: FinalsByGroup }
                  ]
      }, 
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