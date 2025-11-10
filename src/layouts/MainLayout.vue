<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">

    <main-header @toggle-left-drawer="toggleLeftDrawer" />

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="220"
      class="bg-grey-1 shadow-2"
    >
      <main-sidebar />
    </q-drawer>

    <q-page-container class="main-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>

    <main-footer />
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import MainHeader from 'components/MainHeader.vue'
import MainSidebar from 'components/MainSidebar.vue'
import MainFooter from 'components/MainFooter.vue'

const leftDrawerOpen = ref(true)
const $q = useQuasar()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
})
</script>

<style scoped>
.main-layout {
  background-color: #f5f6f8;
}

/* Transición de las vistas */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.main-content {
  background-color: #f5f6f8;
  min-height: calc(100vh - 80px);
  padding: 20px;
  transition: padding 0.3s;
}

@media (max-width: 1024px) {
  .main-content {
    padding: 10px;
  }
}
</style>
