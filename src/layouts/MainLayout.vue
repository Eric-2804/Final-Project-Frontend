<template>
  <q-layout view="hHh lpr fFf" class="main-layout">
    <!-- HEADER -->
    <Header @toggle-drawer="toggleDrawer" />

    <!-- SIDEBAR ÚNICO -->
    <q-drawer
      v-model="drawerOpen"
      :mini="mini"
      :width="220"
      :mini-width="80"
      side="left"
      bordered
      :overlay="!mini"
      elevated
      :breakpoint="0"
      class="bg-primary text-white"
      style="background-color: #1E40AF; color: white;"
    >
      <main-sidebar :mini="mini" />
    </q-drawer>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container 
      class="page-container"
      :class="{ 'with-mini-drawer': drawerOpen && $q.screen.gt.sm }"
    >
      <router-view />
      <main-footer />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import MainSidebar from "../components/Sidebar.vue";
import MainFooter from "../components/Footer.vue";
import Header from "../components/Header.vue";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

// Estado del drawer
const drawerOpen = ref(true);
const mini = ref(true);

function toggleDrawer() {
  if ($q.screen.lt.md) {
    // En móvil, toggle completo del drawer
    drawerOpen.value = !drawerOpen.value;
    if (drawerOpen.value) {
      mini.value = false; // Siempre expandido en móvil
    }
  } else {
    // En desktop, toggle entre mini y expandido
    if (drawerOpen.value) {
      mini.value = !mini.value;
    } else {
      drawerOpen.value = true;
      mini.value = false;
    }
  }
}

// Cierra el drawer en móvil al cambiar de ruta
router.afterEach(() => {
  if ($q.screen.lt.md) {
    drawerOpen.value = false;
    mini.value = false;
  } else {
    // En desktop, vuelve a mini después de navegar
    mini.value = true;
  }
});

// Maneja cambios de tamaño de pantalla
watch(() => $q.screen.gt.sm, (isDesktop) => {
  if (isDesktop) {
    drawerOpen.value = true;
    mini.value = true;
  } else {
    drawerOpen.value = false;
    mini.value = false;
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 50px);
  transition: padding-left 0.3s ease;
  
  
  // Padding solo cuando el drawer está en modo mini (empuja el contenido)
  &.with-mini-drawer {
    padding-left: 80px;
  }
}

.q-page {
  flex-grow: 1;
}

// Transiciones suaves
:deep(.q-drawer) {
  transition: all 0.3s ease;
}
</style>