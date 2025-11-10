<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5">Dashboard</div>
        <div class="text-subtitle2 text-grey">Resumen rápido del sistema</div>
      </div>

      <div>
        <q-btn dense flat icon="refresh" @click="refresh" />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3" v-for="card in cards" :key="card.title">
        <q-card class="q-pa-sm" flat bordered>
          <q-card-section>
            <div class="text-subtitle1">{{ card.title }}</div>
            <div class="text-h6 q-mt-sm">{{ card.value }}</div>
            <div class="text-caption text-grey q-mt-xs">{{ card.desc }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-h6">Actividad reciente</div>
            <div class="text-caption text-grey q-mt-sm">Aquí puedes añadir un listado o gráfico</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-h6">Notificaciones</div>
            <div class="text-caption text-grey q-mt-sm">Placeholder para notificaciones o tareas</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/authStore'

const auth = useAuthStore()

const cards = ref([
  { title: 'Usuarios', value: '120', desc: 'Total usuarios registrados' },
  { title: 'Estudiantes', value: '90', desc: 'Estudiantes activos' },
  { title: 'Profesores', value: '20', desc: 'Profesores asignados' },
  { title: 'Aprobados', value: '75%', desc: 'Promedio de aprobación' }
])

function refresh() {
  console.log('Refrescando dashboard — usuario:', auth.user)
}
</script>

<style scoped>
.q-card {
  border-radius: 8px;
}
</style>
