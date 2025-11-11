<template>
  <q-layout view="lHh Lpr lFf">

    <!-- header -->
    <HeaderComponent
      :leftDrawerOpen="leftDrawerOpen"
      :toggleLeftDrawer="toggleLeftDrawer"
    />

    <!-- menú lateral -->
    <SidebarComponent
      :leftDrawerOpen="leftDrawerOpen"
      :mini="mini"
      @update:leftDrawerOpen="leftDrawerOpen = $event"
    />

    <!-- contenido principal -->
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
import SidebarComponent from '../../components/Sidebar.vue'

export default defineComponent({
  name: 'DashboardCoordinator',
  components: {
    HeaderComponent,
    SidebarComponent
  },
  setup() {
    const leftDrawerOpen = ref(true)
    const mini = ref(false)

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      leftDrawerOpen,
      mini,
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
