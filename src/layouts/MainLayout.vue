<template>
  <q-layout view="hHh lpr fFf" class="main-layout">
    <!-- HEADER -->
    <Header @toggle-drawer="toggleDrawer" />

    <!-- SIDEBAR ÚNICO -->
    <q-drawer
      v-if="authStore.isAuthReady"
      v-model="drawerOpen"
      :mini="mini"
      :width="220"
      :mini-width="80"
      side="left"
      bordered
      overlay
      elevated
      class="bg-primary text-white"
    >
      <main-sidebar :mini="mini" />
    </q-drawer>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container class="page-container">
      <router-view />
      <main-footer />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import MainSidebar from "../components/Sidebar.vue";
import MainFooter from "../components/Footer.vue";
import Header from "../components/Header.vue";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const drawerOpen = ref($q.screen.gt.sm);
const mini = ref($q.screen.gt.sm);

function toggleDrawer() {
  if ($q.screen.lt.md) {
    // On mobile, just toggle the drawer
    drawerOpen.value = !drawerOpen.value;
    mini.value = false; // ensure not in mini mode
  } else {
    // On desktop, toggle the mini state
    mini.value = !mini.value;
  }
}

// Cierra el menú lateral en pantallas de móvil al cambiar de ruta
router.afterEach(() => {
  if ($q.screen.lt.md) {
    drawerOpen.value = false;
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 50px); /* 50px es la altura del header por defecto */
  padding-left: 80px; /* Espacio reservado para el menú mini */
}

.q-page {
  flex-grow: 1;
}
</style>