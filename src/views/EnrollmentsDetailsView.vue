<template>
  <div class="q-pa-md">
    <q-card flat bordered class="card-details">
      <q-card-section class="row items-center justify-between q-px-lg q-pt-lg">
        <div>
          <div class="text-h6">Detalles de Matrícula</div>
          <div class="text-subtitle2 text-grey">Información completa del estudiante</div>
        </div>
        <q-btn color="primary" icon="arrow_back" label="Volver" @click="goBack" />
      </q-card-section>

      <q-separator />
 
      <q-card-section class="q-pa-lg" v-if="enrollment">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Datos del Estudiante</div>
                <div class="q-mt-sm">
                  <p><strong>Nombre:</strong> {{ enrollment.student.names }} {{ enrollment.student.lastNames }}</p>
                  <p><strong>Documento:</strong> {{ enrollment.student.document }}</p>
                  <p><strong>Grado:</strong> {{ enrollment.group.name }}</p>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Datos del Acudiente</div>
                <div class="q-mt-sm" v-if="enrollment.attendant && enrollment.attendant.length > 0">
                  <p><strong>Nombre:</strong> {{ enrollment.attendant[0].names }} {{ enrollment.attendant[0].lastNames }}</p>
                  <p><strong>Teléfono:</strong> {{ enrollment.attendant[0].phone }}</p>
                  <p><strong>Correo:</strong> {{ enrollment.attendant[0].email }}</p>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="q-mt-lg">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">Información Académica</div>
              <div class="q-mt-sm">
                <p><strong>Periodo:</strong> {{ enrollment.year }}</p>
                <p><strong>Estado de matrícula:</strong> 
                  <q-chip 
                    :color="enrollment.state === 'Activo' ? 'green-3' : 'red-3'" 
                    text-color="black" 
                    dense 
                    outline
                  >
                    {{ enrollment.state }}
                  </q-chip>
                </p>
                <p><strong>Fecha de registro:</strong> {{ new Date(enrollment.registrationDate).toLocaleDateString() }}</p>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <p>Cargando detalles de la matrícula...</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const enrollment = ref(null)

onMounted(async () => {
  const enrollmentId = route.params.id;
  if (enrollmentId) {
    try {
      const response = await axios.get(`http://localhost:3000/api/registration/${enrollmentId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      enrollment.value = response.data.data;
    } catch (error) {
      console.error("Error fetching enrollment details:", error);
    }
  }
});

const goBack = () => {
  router.push({ name: 'EnrollmentsView' });
}
</script>

<style scoped>
.card-details {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
  border: 1px solid #e6e9ee;
}
</style>