<template>
  <div>
    <q-btn flat label="Home" to="/" />
    <q-btn flat label="Vista" to="/vista" />

<<<<<<< HEAD
    <q-page-container style="padding-left: 100px">
      <router-view />
    </q-page-container>

    <FooterComponent style="padding-left: 100px" />
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
=======
    <router-view />
  </div>
</template>
>>>>>>> 655f356d64d09b7221d9b896b5a32903c82aef04
