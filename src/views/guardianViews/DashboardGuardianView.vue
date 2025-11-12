<template>
  <q-page class="q-pa-md">

    <q-card flat bordered class="q-mb-md bg-grey-1">
      <q-card-section>
        <div class="text-h6 text-primary">Panel del Acudiente</div>
        <div class="text-subtitle2 text-grey">Resumen general del estudiante</div>
      </q-card-section>
    </q-card> 

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card bordered class="info-card">
          <q-card-section>
            <div class="text-subtitle1 text-bold">Estudiante Representado:</div>
            <div class="text-h6 q-mt-sm">{{ studentName }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-subtitle1 text-bold">Estado de Matrícula:</div>
            <q-badge
              :color="enrollmentStatus === 'Activo' ? 'green' : 'red'"
              class="q-mt-sm"
              align="middle"
            >
              {{ enrollmentStatus }}
            </q-badge>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card bordered class="info-card">
          <q-card-section>
            <div class="text-subtitle1 text-bold">Promedio General:</div>
            <div class="text-h5 text-primary q-mt-sm">{{ average }} / 5.0</div>
            <q-linear-progress
              :value="average / 5"
              color="primary"
              size="10px"
              class="q-mt-sm"
            />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-subtitle1 text-bold">Alertas:</div>
            <ul>
              <li v-for="(alert, index) in alerts" :key="index" class="text-negative">
                {{ alert }}
              </li>
              <li v-if="alerts.length === 0" class="text-positive">
                Sin alertas activas 🎉
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-mt-lg">
      <q-card bordered class="bg-grey-1">
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Últimos Comunicados</div>
          <q-list separator>
            <q-item v-for="(notice, index) in notices" :key="index" clickable>
              <q-item-section>
                <q-item-label class="text-bold">{{ notice.title }}</q-item-label>
                <q-item-label caption>{{ notice.date }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey" />
              </q-item-section>
            </q-item>
            <q-item v-if="notices.length === 0">
              <q-item-section>
                <q-item-label>No hay comunicados recientes.</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const studentName = ref('Juan Sebastián López')
const enrollmentStatus = ref('Activo')
const average = ref(4.3)
const alerts = ref(['Bajo rendimiento en Matemáticas'])
const notices = ref([
  { title: 'Reunión general de padres de familia', date: '2025-11-08' },
  { title: 'Entrega de boletines del segundo periodo', date: '2025-10-25' }
])
</script>

<style scoped>
.info-card {
  transition: box-shadow 0.2s;
}

.info-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
