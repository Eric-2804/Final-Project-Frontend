<script setup>
import login from './views/login.vue';
import router from './router/index.js'
</script>

<template>
  <div>
    <q-btn flat label="login" to="/" />
  
    
    <router-view />
  </div>
</template>