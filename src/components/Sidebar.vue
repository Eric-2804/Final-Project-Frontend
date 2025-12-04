<template>
  <q-scroll-area class="fit">
    <q-list>
      <EssentialLink
        v-for="link in links"
        :key="link.title"
        v-bind="link"
      />
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
    { title: 'Matrículas', icon: 'assignment', link: '/secretaria/matriculas' },
    { title: 'Carga Académica', icon: 'work', link: '/management/carga-academica' },
    { title: 'Grupos', icon: 'group', link: '/management/grupo' },
    { title: 'Indicadores', icon: 'assessment', link: '/management/indicadores' },
    { title: 'Áreas y Materias', icon: 'class', link: '/management/materia-area' },
    { title: 'Periodos', icon: 'event', link: '/management/periodo' },
    { title: 'Vigencia', icon: 'today', link: '/management/vigencia' },
    { title: 'Usuarios', icon: 'people', link: '/management/usuarios-colegio' },
  ],
};

const links = computed(() => {
  const role = userRole.value;
  if (!role) return [];
  return linksByRole[role.toLowerCase()] || [];
});
</script>

<style scoped>
</style>