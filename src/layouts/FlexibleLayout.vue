<template>
  <q-layout view="lHh Lpr lFf" class="flexible-layout">
    <!-- Header -->
    <MainHeader @toggle-left-drawer="toggleLeftDrawer" />

    <!-- Sidebar flotante -->
    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      bordered
      :width="220"
      class="bg-grey-1 shadow-2"
    >
      <MainSidebar />
    </q-drawer>

    <!-- Contenido principal con scroll -->
    <q-page-container class="flexible-content">
      <q-page class="column items-start justify-start">
        <!-- Aquí se renderiza la vista -->
        <slot />

        <!-- Footer al final -->
        <MainFooter />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import MainHeader from '../components/Header.vue'
import MainSidebar from '../components/Sidebar.vue'
import MainFooter from '../components/Footer.vue'

const $q = useQuasar()
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  // En pantallas grandes puede quedar abierto por defecto si prefieres
  if ($q.screen.gt.md) {
    leftDrawerOpen.value = false
  }
})
</script>

<style scoped>
.flexible-layout {
  background-color: #f5f6f8;
}

.flexible-content {
  background-color: #f5f6f8;
  min-height: 100vh;
  padding: 20px;
  transition: padding 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .flexible-content {
    padding: 10px;
  }
}
</style>
