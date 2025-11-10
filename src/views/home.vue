<template>
  <div class="dashboard">
    <h1>Bienvenido, {{ auth.user?.role }}</h1>
    <p>Correo: {{ auth.user?.email }}</p>

    <div class="actions">
      <button @click="logout" class="btn-logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../store/authStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>
