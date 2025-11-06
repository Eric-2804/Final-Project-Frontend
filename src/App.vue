<script setup>
import login from './views/login.vue';
import router from './router/index.js'
</script>

<template>
  <div>
    <q-btn flat label="Home" to="/" />
    <q-btn flat label="Vista" to="/vista" />

    <router-view />
  </div>
</template>