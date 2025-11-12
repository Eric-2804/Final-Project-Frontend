<template>
 <q-layout view="hHh Lpr lFf" class="main-layout no-scroll">


    <!-- HEADER -->
    <q-header class="main-header fixed-header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
          class="menu-toggle-btn"
        />

        <q-toolbar-title>
          Institución Educativa
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" icon="notifications" to="/notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notificaciones</q-tooltip>
          </q-btn>

          <q-btn-dropdown flat no-caps>
            <template v-slot:label>
              <div class="row items-center">
                <q-avatar size="26px" class="q-mr-sm">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
                <span>Administrador</span>
              </div>
            </template>

            <q-list style="min-width: 200px">
              <q-item>
                <q-item-section class="text-center flex-center">
                  <q-avatar size="72px" class="q-mb-sm">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                  <div class="text-subtitle1">Juan Pérez</div>
                  <div class="text-caption text-grey">juan.perez@example.com</div>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup to="/teacher/profile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Mi Perfil</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Cerrar Sesión</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR ÚNICO -->
<q-drawer
  v-model="drawerOpen"
  :mini="!$q.screen.lt.md && mini"
  :overlay="$q.screen.lt.md"
  :width="220"
  :mini-width="70"
  side="left"
  bordered
  class="main-drawer"
>
  <main-sidebar :mini="!$q.screen.lt.md && mini" />
</q-drawer>



    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container class="main-page-container">
      <router-view />
      <main-footer />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import MainSidebar from '../components/Sidebar.vue'
import MainFooter from '../components/Footer.vue'

const $q = useQuasar()
const router = useRouter()

const drawerOpen = ref(true) // visible siempre
const mini = ref(true) // inicia en modo mini

// Alternar entre mini y completo
function toggleDrawer() {
  // En pantallas grandes: alterna mini <-> completo
  if (!$q.screen.lt.md) {
    mini.value = !mini.value
  } else {
    // En móvil: abrir/cerrar completamente
    drawerOpen.value = !drawerOpen.value
  }
}
// Evitar que el menú se cierre al cambiar de ruta
router.afterEach(() => {
  if (!$q.screen.lt.md) {
    drawerOpen.value = true
    mini.value = true
  }
})

// Cerrar sesión
function logout() {
  $q.notify({
    type: 'positive',
    message: 'Sesión cerrada exitosamente',
    position: 'top'
  })
}
</script>


<style scoped>
/* === HEADER FIJO === */
.main-header {
  background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);
  color: white;
  height: 64px;
  z-index: 3001; /* un poco más alto que el drawer */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fixed-header {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
}
.no-scroll {
  overflow-x: hidden;
}

/* === DRAWER PEGADO AL HEADER, SIN EMPUJAR === */
.main-drawer {
  position: fixed !important;
  top: 64px !important; /* justo debajo del header */
  left: 0;
  height: calc(100vh - 64px);
  background:  #1E40AF;
  border-right: none !important;
  box-shadow: none !important;
  z-index: 2500;
  color: white !important;
}

/* === SIDEBAR SUPERPUESTO === */
.overlay-drawer {
  position: fixed !important;
  top: 64px !important;
  left: 0;
  height: calc(100vh - 64px);
  background: #1E40AF;
  border-right: none !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
  z-index: 2500;
  color: white !important;
}

/* Asegurar que el contenido del drawer también tenga el mismo color */
:deep(.q-drawer__content) {
  background-color: #1E40AF !important;
  color: white !important;
}

/* === CONTENIDO PRINCIPAL === */
.main-page-container {
  margin-top: -30px;/* espacio solo para el header */
  margin-left: -50px; /* deja espacio para el menú mini */
  padding: 0;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 64px);
  padding-top: 0;
}
.q-page-container {
  padding-left: 0 !important;
  margin-left: 0 !important;
}

/* === EVITAR QUE EL CONTENIDO SE MUEVA CUANDO EL DRAWER ESTÁ EXPANDIDO === */
.q-drawer--standard:not(.q-drawer--mini) {
  position: fixed !important;
}

.q-drawer--standard:not(.q-drawer--mini) ~ .main-page-container {
  margin-left: 70px !important; /* mantiene el contenido quieto */
}
/* === BLOQUEA CUALQUIER DESPLAZAMIENTO DEL CONTENIDO === */
.q-layout__section--main {
  transform: none !important;
  transition: none !important;
}

/* Fuerza el drawer a ser flotante y no empujar el contenido */
.q-drawer {
  position: fixed !important;
  transform: none !important;
  transition: none !important;
  will-change: auto !important;
  z-index: 3000 !important;
}

/* Cuando se expande, no empuja el contenido */
.q-drawer:not(.q-drawer--mini) ~ .q-page-container {
  margin-left: 70px !important;
  transform: none !important;
}

/* En modo overlay, cubre el contenido */
.q-drawer--on-top {
  position: fixed !important;
  left: 0 !important;
  top: 64px !important;
  height: calc(100vh - 64px);
  z-index: 3000 !important;
}
/* === ELIMINAR LÍNEA BLANCA ENTRE MENU Y FOOTER === */
.main-drawer,
.q-drawer,
:deep(.q-drawer__content) {
  height: 100vh !important; /* asegura que cubra todo el alto */
  min-height: 100vh !important;
  bottom: 0 !important;
  background-color: #1E40AF !important; /* refuerza el color */
}

.q-layout__section--main {
  background-color: white; /* asegura contraste, sin línea blanca */
}

main-footer {
  margin-left: 0 !important;
  background-color: white !important;
}

/* En pantallas grandes (desktop) deja espacio para el menú mini */
@media (min-width: 1024px) {
  .main-page-container {
    margin-left: 70px !important;
  }
}

/* En pantallas pequeñas (móvil) el menú flota completamente */
@media (max-width: 1023px) {
  .main-drawer {
    position: fixed !important;
    top: 64px !important; /* justo debajo del header */
    height: calc(100vh - 64px) !important;
    z-index: 1000 !important; /* debajo del header */
    width: 220px !important;
  }
  .q-drawer__content {
    padding-top: 70px !important; /* espacio adicional para que no se corte */
  }
  :deep(.q-drawer__content) {
    padding-top: 70px !important; /* espacio para que el menú no quede oculto */
  }
}

</style>
