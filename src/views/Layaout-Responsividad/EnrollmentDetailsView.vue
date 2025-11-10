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

      <q-card-section class="q-pa-lg">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Datos del Estudiante</div>
                <div class="q-mt-sm">
                  <p><strong>Nombre:</strong> {{ enrollment.student.name }}</p>
                  <p><strong>Documento:</strong> {{ enrollment.student.document }}</p>
                  <p><strong>Grado:</strong> {{ enrollment.grade }}</p>
                  <p><strong>Jornada:</strong> {{ enrollment.session }}</p>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Datos del Acudiente</div>
                <div class="q-mt-sm">
                  <p><strong>Nombre:</strong> {{ enrollment.guardian.name }}</p>
                  <p><strong>Teléfono:</strong> {{ enrollment.guardian.phone }}</p>
                  <p><strong>Correo:</strong> {{ enrollment.guardian.email }}</p>
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
                <p><strong>Periodo:</strong> {{ enrollment.period }}</p>
                <p><strong>Estado de matrícula:</strong> 
                  <q-chip 
                    :color="enrollment.status === 'Activa' ? 'green-3' : 'red-3'" 
                    text-color="black" 
                    dense 
                    outline
                  >
                    {{ enrollment.status }}
                  </q-chip>
                </p>
                <p><strong>Fecha de registro:</strong> {{ enrollment.date }}</p>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="q-mt-lg row justify-end q-gutter-sm">
          <q-btn color="primary" icon="edit" label="Editar Matrícula" />
          <q-btn color="negative" icon="delete" label="Eliminar" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Datos simulados de la matrícula (se reemplazará con datos reales luego)
const enrollment = ref({
  student: {
    name: 'Juan Pérez',
    document: '1023456789'
  },
  grade: '7° A',
  session: 'Mañana',
  guardian: {
    name: 'María López',
    phone: '3004567890',
    email: 'maria.lopez@gmail.com'
  },
  period: '2025',
  status: 'Activa',
  date: '2025-02-15'
})

const goBack = () => {
  router.push('/matriculas')
}
</script>

<style scoped>
.card-details {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
  border: 1px solid #e6e9ee;
}
</style>
