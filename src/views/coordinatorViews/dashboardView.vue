<template>
  <q-layout view="hHh lpR fFf">
    <!-- header -->
    <HeaderComponent
      :leftDrawerOpen="leftDrawerOpen"
      :toggleLeftDrawer="toggleLeftDrawer"
    />

    <!-- Botones de navegación de vistas coordinador -->
    <div class="coordinator-nav-btns q-pa-md" style="background: #f5f6f8; display: flex; gap: 12px; justify-content: flex-end; align-items: center;">
      <q-btn label="Gestión de Grupos" color="primary" flat to="/groupManagementCoordinator" />
      <q-btn label="Inscripciones" color="primary" flat to="/registrationsCoordinator" />
      <q-btn label="Comunicados" color="primary" flat to="/pressReleasesCoordinator" />
      <q-btn label="Monitoreo" color="primary" flat to="/teacherMonitoringCoordinator" />
    </div>

    <!-- contenido -->
    <q-page-container>
      <q-page class="q-pa-md">
        <h1>bienvenido al panel del coordinador</h1>
        <p>contenido visible desde dashboardView.vue</p>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, defineComponent } from 'vue'
import HeaderComponent from '../../components/Header.vue'

export default defineComponent({
  name: 'DashboardCoordinator',
  components: {
    HeaderComponent
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer
    }
  }
})
</script>

<style scoped>
h1 {
  color: #1e40af;
}
</style>
