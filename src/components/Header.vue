<template>
  <q-header elevated class="header-fixed">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-drawer')"
        class="q-mr-sm"
      />

      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>

      <q-space />

      <div v-if="isAuthReady && user" class="q-gutter-sm row items-center no-wrap">
        <q-btn round dense flat color="white" icon="notifications" :to="communicationsLink">
          <q-badge color="red" text-color="white" floating>
            2
          </q-badge>
          <q-tooltip>Notificaciones</q-tooltip>
        </q-btn>

        <q-btn-dropdown flat no-caps>
          <template v-slot:label>
            <div class="row items-center">
              <q-avatar size="26px" class="q-mr-sm">
                <img :src="profilePhotoUrl">
              </q-avatar>
              <span>{{ user.names }} ({{ userRole }})</span>
            </div>
          </template>

          <q-list style="min-width: 200px">
            <q-item>
              <q-item-section class="text-center flex-center">
                <q-avatar size="72px" class="q-mb-sm">
                  <img :src="profilePhotoUrl">
                </q-avatar>
                <div class="text-subtitle1">{{user.names}} {{ user.lastNames }}</div>
                <div class="text-caption text-grey">{{user.email}}</div>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup :to="profileLink">
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
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from "../stores/auth.js";
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import api from '../services/api'; // Importa la instancia de api

const auth = useAuthStore();
const router = useRouter();

const { isAuthReady, userRole } = storeToRefs(auth);
const user = computed(() => auth.user);

const profilePhotoUrl = computed(() => {
  const defaultAvatar = 'https://cdn.quasar.dev/img/boy-avatar.png';
  if (user.value && user.value.profilePhoto) {
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    // Asegurarse de que la URL de la foto no tenga ya un slash inicial
    const photoPath = user.value.profilePhoto.startsWith('/') ? user.value.profilePhoto.slice(1) : user.value.profilePhoto;
    return `${baseUrl}/${photoPath}`;
  }
  return defaultAvatar;
});

const title = computed(() => {
  if (!userRole.value) return 'Institución Educativa';
  const role = userRole.value.toLowerCase();
  switch (role) {
    case 'rector':
      return 'Panel del Rector';
    case 'teacher':
      return 'Panel del Docente';
    case 'student':
      return 'Panel del Estudiante';
    case 'coordinator':
      return 'Panel del Coordinador';
    case 'guardian':
      return 'Panel del Acudiente';
    default:
      return 'Institución Educativa';
  }
});

const profileLink = computed(() => {
  if (!userRole.value) return '/';
  const role = userRole.value.toLowerCase();
  switch (role) {
    case 'rector':
      return '/rector/profile';
    case 'teacher':
      return '/teacher/profile';
    case 'student':
      return '/student/profile';
    case 'coordinator':
      return '/coordinator/profile';
    case 'guardian':
      return '/guardian/profile';
    case 'secretaria':
      return '/secretaria/profile';
    default:
      return '/';
  }
});

const communicationsLink = computed(() => {
  if (!userRole.value) return '/';
  const role = userRole.value.toLowerCase();
  switch (role) {
    case 'rector':
      return '/rector/communications';
    case 'teacher':
      return '/teacher/communications';
    case 'student':
      return '/student/communications';
    case 'coordinator':
      return '/coordinator/communications';
    case 'guardian':
      return '/guardian/communications';
    default:
      return '/';
  }
});

const logout = () => {
  auth.logout();
  router.push('/');
};
</script>

<style scoped>
.header-fixed {
  background-color: #1E40AF;
  color: white;
  z-index: 2000;
}
</style>