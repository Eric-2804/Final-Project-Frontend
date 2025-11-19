<template>
  <!-- 1. Si es una ruta de profesor, se muestra el Layout principal COMPLETO -->
  <MainLayout v-if="isTeacherRoute" />

  <!-- 2. Si NO es ruta de profesor, se muestra un layout simple con TUS botones de navegación -->
  <q-layout v-else view="lHh Lpr lFf">
    
    <!-- Tu barra de botones para desarrollo -->
    <div class="q-pa-sm bg-grey-3">
      <q-btn flat label="login" to="/" />
      <q-btn flat label="dashboard" to="/dashboardCoordinator" />
      <q-btn flat label="Perfil Estudiante" to="/perfil-Student" />
      <q-btn flat label="Dashboard Estudiante" to="/dashboard" />
      <q-btn flat label="Sedes de la secretaria" to="/sedesSecretaria" />
    </div>

    <!-- El contenido de las otras páginas (login, etc.) -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()

// Propiedad que comprueba si la ruta actual es de un profesor
const isTeacherRoute = computed(() => {
  const teacherPaths = [
    '/teacherDashboard',
    '/teacherProfile',
    '/teacherGroups',
    '/teacherAcademicManagement',
    '/teacherPerformanceIndicators',
    '/teacherGroupReports',
    '/teacherCommunications'
  ];
  
  // Devuelve true si la URL actual empieza con alguna de las rutas de la lista
  return teacherPaths.some(path => route.path.startsWith(path));
});
</script>