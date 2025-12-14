<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card flat bordered class="form-card">
        <q-card-section class="bg-primary text-white text-h6">
          Formulario de Matrícula
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitForm" class="q-gutter-md">

            <!-- Datos del estudiante -->
            <div class="text-subtitle1 text-primary q-mt-sm">Datos del Estudiante</div>

            <div class="row q-col-gutter-md">
              <q-input filled v-model="form.nombre" label="Nombre completo" class="col-12 col-md-6" />
              <q-input filled v-model="form.identificacion" label="Número de identificación" class="col-12 col-md-6" />
              <q-input filled v-model="form.fechaNacimiento" label="Fecha de nacimiento" type="date" class="col-12 col-md-6" />
              <q-select filled v-model="form.genero" :options="['Masculino', 'Femenino']" label="Género" class="col-12 col-md-6" />
            </div>

            <!-- Datos del acudiente -->
            <div class="text-subtitle1 text-primary q-mt-lg">Datos del Acudiente</div>

            <div class="row q-col-gutter-md">
              <q-input filled v-model="form.acudiente" label="Nombre del acudiente" class="col-12 col-md-6" />
              <q-input filled v-model="form.parentesco" label="Parentesco" class="col-12 col-md-6" />
              <q-input filled v-model="form.telefono" label="Teléfono de contacto" class="col-12 col-md-6" />
              <q-input filled v-model="form.email" label="Correo electrónico" type="email" class="col-12 col-md-6" />
            </div>

            <!-- Datos académicos -->
            <div class="text-subtitle1 text-primary q-mt-lg">Datos Académicos</div>

            <div class="row q-col-gutter-md">
              <q-select filled v-model="form.grado" :options="grados" label="Grado a matricular" class="col-12 col-md-6" />
              <q-select filled v-model="form.jornada" :options="['Mañana', 'Tarde']" label="Jornada" class="col-12 col-md-6" />
              <q-input filled v-model="form.año" label="Año lectivo" type="number" class="col-12 col-md-6" />
            </div>

            <div class="text-right q-mt-lg">
              <q-btn :loading="loading" label="Registrar Matrícula" color="primary" icon="save" type="submit" />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotify } from '../composables/useNotify'
import registrationService from '../services/registrationService.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const { showNotify, showErrorNotify } = useNotify()
const auth = useAuthStore()

const loading = ref(false)
const form = ref({
  nombre: '',
  identificacion: '',
  fechaNacimiento: '',
  genero: '',
  acudiente: '',
  parentesco: '',
  telefono: '',
  email: '',
  grado: '',
  jornada: '',
  año: new Date().getFullYear()
}) 

const grados = [
  'Preescolar',
  'Primero',
  'Segundo',
  'Tercero',
  'Cuarto',
  'Quinto',
  'Sexto',
  'Séptimo',
  'Octavo',
  'Noveno',
  'Décimo',
  'Undécimo'
]

async function submitForm() {
  if (!form.value.nombre || !form.value.identificacion || !form.value.grado) {
    showErrorNotify('Por favor completa los campos obligatorios')
    return
  }

  loading.value = true
  try {
    await registrationService.create(form.value)
    showNotify('Matrícula registrada correctamente')
    
    // Reiniciar formulario
    Object.keys(form.value).forEach(k => form.value[k] = '')
    form.value.año = new Date().getFullYear()
    
    // Redirigir a la lista de matrículas después de 1 segundo
    setTimeout(() => {
      router.push({ name: 'Mis_Matrícula' })
    }, 1000)
  } catch (error) {
    console.error('Error al crear matrícula:', error)
    const msg = error?.response?.data?.msg || error?.response?.data?.error || 'Error al registrar la matrícula'
    showErrorNotify(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 10px;
}

@media (max-width: 1024px) {
  .form-card {
    max-width: 95%;
  }
}
</style>
