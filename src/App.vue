<template>
  <q-layout view="lHh Lpr lFf" class="full-height-layout">
    <HeaderComponent
      :left-drawer-open="leftDrawerOpen"
      :toggle-left-drawer="toggleLeftDrawer"
    />
    <SidebarComponent
      :left-drawer-open="leftDrawerOpen"
      :mini="miniState"
      @update:left-drawer-open="toggleLeftDrawer"
    />

    <q-page-container>
      <router-view />
    </q-page-container>

    <FooterComponent />
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import HeaderComponent from './components/Header.vue'
import SidebarComponent from './components/Sidebar.vue'
import FooterComponent from './components/Footer.vue'

export default defineComponent({
  name: 'App',

  components: {
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  },

  setup () {
    const leftDrawerOpen = ref(true)
    const miniState = ref(false)

    function toggleLeftDrawer () {
      if (leftDrawerOpen.value) {
        miniState.value = !miniState.value
      } else {
        leftDrawerOpen.value = true
        miniState.value = false
      }
    }

    return {
      leftDrawerOpen,
      miniState,
      toggleLeftDrawer
    }
  }
})
</script>

<style scoped>
.full-height-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.q-page-container {
  flex-grow: 1;
}

/* Forzar visibilidad de iconos en modo mini del menú */
.q-drawer--mini .q-item__section--avatar {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.q-drawer--mini .q-item__section--avatar .q-icon {
  color: white !important;
}
.q-footer {
  position: relative;
  z-index: 1;
}
.dashboard-page {
  padding-bottom: 100px; /* evita que el texto toque el footer */
}
</style>