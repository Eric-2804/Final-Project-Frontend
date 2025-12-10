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
        <q-btn round dense flat color="white" icon="notifications">
          <q-badge v-if="unreadCount > 0" color="red" text-color="white" floating>
            {{ unreadCount }}
          </q-badge>
          <q-tooltip>Notificaciones</q-tooltip>
          <q-menu anchor="top right" self="top left">
            <q-list style="min-width: 300px; max-width: 400px;">
              <q-item-label header>Notificaciones</q-item-label>
              <q-item
                v-for="notif in notifications"
                :key="notif.id"
                clickable
                v-close-popup
                @click="navigateTo(notif.link)"
                :class="{ 'font-weight-bold': !notif.read }"
              >
                <q-item-section>
                  <q-item-label lines="2">{{ notif.title }}</q-item-label>
                  <q-item-label caption>{{ formatTimeAgo(notif.date) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup class="text-center" :to="communicationsLink">
                <q-item-section>Ver todas</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
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
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from "../stores/auth.js";
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import api from '../services/api';
// import { getUserNotifications } from '../services/notificationsService';

const auth = useAuthStore();
const router = useRouter();

const { isAuthReady, userRole } = storeToRefs(auth);
const user = computed(() => auth.user);

const notifications = ref([]);
const unreadCount = computed(() => {
  if (!Array.isArray(notifications.value)) return 0;
  return notifications.value.filter(n => !n.read).length;
});

// onMounted(async () => {
//   if (user.value) {
//     try {
//       notifications.value = await getUserNotifications();
//     } catch (error) {
//       console.error("Error fetching user notifications:", error);
//       notifications.value = [];
//     }
//   }
// });

function navigateTo(link) {
  if (link && link !== '#') {
    router.push(link);
  }
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " años";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " días";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutos";
  return Math.floor(seconds) + " segundos";
}

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
  if (user.value && user.value.college && user.value.college.nameSchool) {
    return user.value.college.nameSchool;
  }
  if (user.value && user.value.school && user.value.school.nameSchool) {
    return user.value.school.nameSchool;
  }
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
    case 'secretaria':
      return '/secretaria/notifications';
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