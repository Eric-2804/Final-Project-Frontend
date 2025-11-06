<template>
  <q-layout view="lHh Lpr lFf">
    <main-header @toggle-left-drawer="toggleLeftDrawer" />
    <main-sidebar v-model="leftDrawerOpen" />
    <main-footer />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import MainHeader from '@/components/Header.vue';
import MainFooter from '@/components/Footer.vue';
import MainSidebar from '@/components/Sidebar.vue';

defineOptions({
  name: 'MainLayout'
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>