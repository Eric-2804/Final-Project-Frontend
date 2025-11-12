<template>
  <div class="q-pa-md responsive-dashboard">
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Tarjetas de resumen -->
      <div
        v-for="(card, index) in summaryCards"
        :key="index"
        class="col-12 col-sm-6 col-md-3"
      >
        <q-card class="q-pa-md text-center card-summary">
          <q-icon :name="card.icon" size="40px" color="primary" />
          <div class="text-h6 q-mt-sm">{{ card.title }}</div>
          <div class="text-subtitle2 text-grey-7">{{ card.value }}</div>
        </q-card>
      </div>
    </div>

    <!-- Contenedor principal -->
    <div class="row q-col-gutter-md q-mt-md">
      <!-- Gráfico de asistencia -->
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md card-section">
          <div class="text-h6 q-mb-sm">Gráfico de Asistencia</div>
          <div class="chart-placeholder">
            <q-icon name="insert_chart" size="80px" color="grey-6" />
            <p class="text-grey-7">Aquí irá un gráfico (ej. Chart.js o ApexCharts)</p>
          </div>
        </q-card>
      </div>

      <!-- Lista de avisos -->
      <div class="col-12 col-md-4">
        <q-card class="q-pa-md card-section">
          <div class="text-h6 q-mb-sm">Avisos Recientes</div>
          <q-list bordered separator>
            <q-item v-for="(notice, index) in notices" :key="index">
              <q-item-section>
                <q-item-label>{{ notice.title }}</q-item-label>
                <q-item-label caption>{{ notice.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const summaryCards = ref([
  { title: 'Estudiantes', value: 245, icon: 'school' },
  { title: 'Profesores', value: 32, icon: 'person' },
  { title: 'Cursos', value: 18, icon: 'book' },
  { title: 'Asistencia Hoy', value: '92%', icon: 'check_circle' }
])

const notices = ref([
  { title: 'Reunión de docentes', date: '10 Nov 2025' },
  { title: 'Entrega de boletines', date: '12 Nov 2025' },
  { title: 'Inicio de evaluaciones', date: '15 Nov 2025' }
])
</script> 

<style scoped>
.card-summary {
  border-radius: 12px;
  transition: transform 0.2s;
}

.card-summary:hover {
  transform: translateY(-4px);
}

.card-section {
  border-radius: 12px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 220px;
  border: 2px dashed #ccc;
  border-radius: 8px;
}

/* RESPONSIVIDAD */

/* Tablets */
@media (max-width: 1024px) {
  .responsive-dashboard {
    padding: 8px !important;
  }

  .chart-placeholder {
    height: 180px;
  }
}

/* Celulares */
@media (max-width: 600px) {
  .text-h6 {
    font-size: 1.1rem;
  }

  .text-subtitle2 {
    font-size: 0.9rem;
  }

  .chart-placeholder {
    height: 150px;
  }

  .card-summary {
    text-align: center;
  }
}
</style>
