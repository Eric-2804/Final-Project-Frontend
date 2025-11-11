<template>
  <q-layout view="hHh lpR fFf">
    <!-- header -->
    <HeaderComponent
      :leftDrawerOpen="leftDrawerOpen"
      :toggleLeftDrawer="toggleLeftDrawer"
    />

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
