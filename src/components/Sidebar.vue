<template>
  <q-scroll-area class="fit custom-sidebar">
    <q-list>
      <template v-for="link in links" :key="link.title">
        <!-- Renderiza un menú desplegable si el enlace tiene hijos -->
        <q-expansion-item
          v-if="link.children && link.children.length > 0"
          :icon="link.icon"
          :label="link.title"
          class="text-white"
          header-class="text-white"
          expand-separator
        >
          <!-- Los elementos hijos van dentro de su propia q-list para un manejo correcto -->
          <q-list class="q-pl-md">
            <q-item
              v-for="child in link.children"
              :key="child.title"
              clickable
              :to="child.link"
              active-class="my-menu-link"
              class="text-white"
            >
              <q-item-section v-if="child.icon" avatar>
                <q-icon :name="child.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ child.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Renderiza un enlace normal si no tiene hijos -->
        <EssentialLink
          v-else
          v-bind="link"
        />
      </template>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import EssentialLink from './EssentialLink.vue';

const authStore = useAuthStore();
const userRole = computed(() => authStore.isAuthReady && authStore.user ? authStore.user.rol : null);

const linksByRole = {
  rector: [
    { title: 'Dashboard', icon: 'dashboard', link: '/rector/dashboard' },
    { title: 'Dirección Núcleo', icon: 'device_hub', link: '/rector/direccion-nucleo' },
    { title: 'Colegios', icon: 'school', link: '/rector/colegios' },
    { title: 'Sedes', icon: 'business', link: '/rector/sedes' },
    { title: 'Matrículas', icon: 'person_add', link: '/rector/matriculas' },
    { title: 'Estructura Académica', icon: 'schema', link: '/rector/estructura-academica' },
    { title: 'Asignación Docente', icon: 'assignment_ind', link: '/rector/asignacion-docente' },
  ],
  coordinador: [
    { title: 'Dashboard', icon: 'dashboard', link: '/dashboardCoordinator' },
    { title: 'Gestión Académica', icon: 'school', link: '/generalAcademicCoordinator' },
    { title: 'Gestión de Grupos', icon: 'group', link: '/groupManagementCoordinator' },
    { title: 'Indicadores', icon: 'assessment', link: '/indicatorsCoordinator' },
    { title: 'Reportes', icon: 'article', link: '/institutionalReportsCoordinator' },
    { title: 'Comunicados', icon: 'campaign', link: '/pressReleasesCoordinator' },
    { title: 'Matrículas', icon: 'person_add', link: '/registrationsCoordinator' },
    { title: 'Seguimiento a Docentes', icon: 'follow_the_signs', link: '/teacherMonitoringCoordinator' },
  ],
  profesor: [
    { title: 'Dashboard', icon: 'dashboard', link: '/teacher/dashboard' },
    { title: 'Mis Grupos y Materias', icon: 'group', link: '/teacher/groups' },
    { title: 'Gestión Académica', icon: 'school', link: '/teacher/academic-management' },
    { title: 'Indicadores de Desempeño', icon: 'assessment', link: '/teacher/performance-indicators' },
    { title: 'Reportes del Grupo', icon: 'article', link: '/teacher/group-reports' },
  ],
  estudiante: [
    { title: 'Dashboard', icon: 'dashboard', link: '/student/dashboard' },
  ],
  acudiente: [
    { title: 'Dashboard', icon: 'dashboard', link: '/DashboardGuardian' },
    { title: 'Asistencia', icon: 'event_available', link: '/AttendancePage' },
    { title: 'Matrículas', icon: 'person_add', link: '/EnrollmentsView' },
    { title: 'Calificaciones', icon: 'grading', link: '/GradesView' },
    { title: 'Información del Estudiante', icon: 'face', link: '/StudentInfoView' },
    { title: 'Carga Académica', icon: 'work', link: '/AcademicLoad' },
  ],
  secretaria: [
    { title: 'Dashboard', icon: 'dashboard', link: '/secretaria/dashboard' },
    { title: 'Sedes', icon: 'business', link: '/secretaria/headquarters' },
    { title: 'Matrículas', icon: 'assignment', link: '/secretaria/enrollments' },
    { title: 'Gestión Académica', icon: 'work', link: '/secretaria/academicManagement' },
    { title: 'Grupos', icon: 'group', link: '/management/grupo' },
    { title: 'Indicadores', icon: 'assessment', link: '/management/indicadores' },
    { title: 'Áreas y Materias', icon: 'class', link: '/management/materia-area' },
    { title: 'Periodos', icon: 'event', link: '/secretaria/periodo' },
    { title: 'Vigencia', icon: 'today', link: '/management/vigencia' },
    { title: 'Usuarios', icon: 'people', link: '/management/usuarios-colegio' },
    {
      title: 'Configuraciones',
      icon: 'settings',
      children: [
        { title: 'Configurar Sistema', icon: 'settings_applications', link: '/configuracion/sistema' },
      ],
    },
  ],
};

const links = computed(() => {
  const role = userRole.value;
  if (!role) return [];
  return linksByRole[role.toLowerCase()] || [];
});
</script>

<style lang="scss">
.custom-sidebar {
  background-color: #1E40AF;
  color: white;
}

/* Estilos para el enlace activo */
.my-menu-link {
  background-color: transparent !important;
  position: relative;
  color: #60a5fa !important; /* Color de texto azul claro para el enlace activo */
}

.my-menu-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 3px;
  background-color: #3B82F6;
}
</style>