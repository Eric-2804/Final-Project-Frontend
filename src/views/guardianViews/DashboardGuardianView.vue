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
            <div class="text-h5 text-primary q-mt-sm">{{ typeof average === 'number' ? average.toFixed(1) : 'N/A' }} / 5.0</div>
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import axios from 'axios'

const auth = useAuthStore()
const studentName = ref('Cargando...')
const enrollmentStatus = ref('Cargando...')
const average = ref(0)
const alerts = ref([])
const notices = ref([])

onMounted(async () => {
  if (auth.user && auth.user.id) {
    try {
      const response = await axios.get(`http://localhost:3000/api/registration/students-by-attendant/${auth.user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      const registrations = response.data.data;
      if (registrations && registrations.length > 0) {
        const studentRegistration = registrations[0]; // Assuming one student per guardian for now
        if (studentRegistration.student) {
          studentName.value = `${studentRegistration.student.names} ${studentRegistration.student.lastNames}`;
        }
        enrollmentStatus.value = studentRegistration.state || 'No disponible';
        average.value = studentRegistration.finalAverage || 0;

        // Fetch grades to generate alerts
        if (studentRegistration.student && studentRegistration.student._id) {
          const gradesResponse = await axios.get(`http://localhost:3000/api/calificaciones/estudiantes/${studentRegistration.student._id}/calificaciones`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          const grades = gradesResponse.data.data;
          if (grades && Array.isArray(grades)) {
            const lowGrades = grades.filter(grade => grade.final_grade < 3.0);
            alerts.value = lowGrades.map(grade => `Bajo rendimiento en ${grade.subject ? grade.subject.name : 'materia desconocida'}`);
          }
        }
      } else {
        studentName.value = "No se encontraron estudiantes";
        enrollmentStatus.value = "N/A";
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      studentName.value = "Error al cargar";
      enrollmentStatus.value = "Error al cargar";
    }
  }
});

</script>

<style scoped>
.info-card {
  transition: box-shadow 0.2s;
}

.info-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>