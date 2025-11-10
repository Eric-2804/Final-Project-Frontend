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
              <q-btn label="Registrar Matrícula" color="primary" icon="save" type="submit" />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify'

const { showNotify, showErrorNotify } = useNotify()

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

function submitForm() {
  if (!form.value.nombre || !form.value.identificacion || !form.value.grado) {
    showErrorNotify('Por favor completa los campos obligatorios')
    return
  }

  showNotify('Matrícula registrada correctamente')
  console.log('Datos enviados:', form.value)

  // Reiniciar formulario
  Object.keys(form.value).forEach(k => form.value[k] = '')
  form.value.año = new Date().getFullYear()
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
