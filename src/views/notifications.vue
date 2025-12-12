<template>
  <q-page class="q-pa-md">
    <div class="notifications-container">
      <h1 class="page-title">Notificaciones</h1>
      <q-list bordered separator>
        <q-item v-for="notification in notifications" :key="notification.id" clickable v-ripple>
          <q-item-section>
            <q-item-label>{{ notification.title }}</q-item-label>
            <q-item-label caption>{{ notification.message }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-item-label caption>{{ new Date(notification.createdAt).toLocaleString() }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-if="notifications.length === 0" class="no-notifications">
        <p>No hay notificaciones nuevas.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserNotifications } from '../services/notificationsService';

const notifications = ref([]);

onMounted(async () => {
  try {
    const response = await getUserNotifications();
    notifications.value = response;
  } catch (error) {
    console.error('Error al cargar las notificaciones:', error);
  }
});
</script>

<style scoped>
.notifications-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.no-notifications {
  text-align: center;
  margin-top: 2rem;
  color: #888;
}
</style>