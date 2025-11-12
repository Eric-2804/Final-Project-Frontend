<template>
  <component :is="isLoginRoute ? 'div' : MainLayout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()
const isLoginRoute = computed(() => route.path === '/')
</script>