import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

// vistas generales
import login from '../views/login.vue'
import Home from '../views/home.vue'


import SedesSecretaria from '../views/headquartersSecretary.vue'
import DashboardSecretaria from '../views/DashboardSecretaria.vue'
import AcademicManagementView from "../views/AcademicManagementView.vue"
import CalificacionView from "../views/CalificacionView.vue"
import teacher from "../views/teacher.vue"
import PeriodoView from "../views/PeriodoView.vue"
import Profile from "../views/Profile.vue"
import SubjectView from "../views/SubjectView.vue"
import Register from '../views/Register.vue'
import Notifications from '../views/notifications.vue'
import Groups from '../views/groups.vue'
import RegistrationListView from '../views/RegistrationListView.vue'
import RegistrationCreateView from '../views/RegistrationCreateView.vue'
import RegistrationDetailView from '../views/RegistrationDetailView.vue'
import RegistrationEditView from '../views/RegistrationEditView.vue'
import UsersView from '../views/UsersView.vue'
import { useAuthStore } from '../stores/auth';

const routes = [
  // rutas públicas → sin layout
  { path: '/', name: 'login', component: login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },

  // rutas internas → con MainLayout
  {
    path: '/',
    component: MainLayout,
    children: [
      
      { path: 'secretaria/teacher', name : 'Gestion de profesores', component: teacher },
      { path: 'secretaria/dashboard', name: 'SecretariaDashboard', component: DashboardSecretaria },
      { path: 'secretaria/headquarters', name: 'sedes_Secretaria', component: SedesSecretaria },
      { path: 'secretaria/academicManagement', name: "Gestion_Academica", component: AcademicManagementView },
      { path: 'secretaria/calificacion', name: "Gestion_Calificaciones", component: CalificacionView },
      { path: 'secretaria/registrations', name: "Gestion_Matriculas", component: RegistrationListView},
      { path: 'secretaria/registrations/create', name: "Crear_Matricula", component: RegistrationCreateView},
      { path: 'secretaria/registrations/:id', name: "Detalles_Matrícula", component: RegistrationDetailView},
      { path: 'secretaria/registrations/:id/edit', name: "Editar_Matricula", component: RegistrationEditView},
      { path: 'secretaria/periodo', name: "Gestion_Periodos", component: PeriodoView},
      { path: 'secretaria/profile', name: "Perfil", component: Profile},
      { path: 'secretaria/register', name: "Registro", component: Register},
      { path: 'management/materia-area', name: "Gestion_Materias_Areas", component: SubjectView},
      { path: 'secretaria/notifications', name: "Notificaciones", component: Notifications},
      { path: 'secretary/group', name: 'Groups', component: Groups},
      { path: 'secretaria/users', name: "Gestion_Usuarios", component: UsersView}
    ]
  }
]

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
        secretaria: '/secretaria/dashboard',
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