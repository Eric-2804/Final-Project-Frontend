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
import NotificationsView from '../views/NotificationsView.vue'
import teacher from '../views/teacher.vue'

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
      {
        path: '/configuracion/sistema',
        name: 'SystemConfiguration',
        component: () => import('../views/systemConfiguration.vue'),
        meta: { requiresAuth: true, roles: ['secretaria'] }
      },


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
      { path: 'secretaria/notifications', name: "Notificaciones", component: NotificationsView},
      { path: 'secretaria/teacher', name: "profesores", component: teacher}
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