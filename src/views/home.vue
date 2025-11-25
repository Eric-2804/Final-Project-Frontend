<template>
  <q-page class="q-pa-md">
  <div class="dashboard">
    <h1>Bienvenido, {{ auth.user?.firstName }}</h1>
    <p>Correo: {{ auth.user?.email }}</p>
    <p>Rol: {{ auth.userRole }}</p>

    <div class="actions">
      <button @click="logout" class="btn-logout">Cerrar sesión</button>
    </div>
  </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from "../stores/auth.js";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>