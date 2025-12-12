<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card class="shadow1">
          <q-card-section class="bg-primary text-white">
            <div class="text-h5">Editar Matrícula</div>
            <div class="text-caption">Modifique los datos de la matrícula existente</div>
          </q-card-section>

          <q-separator />

          <!-- Loading spinner -->
          <div v-if="isLoading" class="text-center q-pa-xl">
            <Spinner size="50px" />
            <div class="text-caption q-mt-md">Cargando información...</div>
          </div>

          <q-card-section v-else-if="form">
            <q-form @submit.prevent="submitForm" class="q-gutter-md">

              <!-- SECCIÓN 1: Datos Generales -->
              <div class="form-section">
                <div class="text-h6 text-primary q-mb-md">
                  <q-icon name="info" class="q-mr-sm" />
                  Datos Generales
                </div>

                <div class="row q-col-gutter-md">
                  <!-- Año -->
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="form.year"
                      :options="yearOptions"
                      label="Año *"
                      filled
                      emit-value
                      map-options
                      :rules="[val => !!val || 'El año es requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="event" />
                      </template>
                    </q-select>
                  </div>

                  <!-- Fecha de matrícula -->
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="form.registrationDate"
                      label="Fecha de Matrícula *"
                      type="date"
                      filled
                      :rules="[val => !!val || 'La fecha es requerida']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calendar_today" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Número de matrícula -->
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="form.registrationNumber"
                      label="Número de Matrícula *"
                      filled
                      :rules="[val => !!val || 'El número es requerido']"
                      hint="Ej: MAT-2025-001"
                    >
                      <template v-slot:prepend>
                        <q-icon name="confirmation_number" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Descripción -->
                  <div class="col-12">
                    <q-input
                      v-model="form.description"
                      label="Descripción *"
                      type="textarea"
                      filled
                      rows="3"
                      :rules="[val => !!val || 'La descripción es requerida']"
                    />
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- SECCIÓN 2: Información de solo lectura -->
              <div class="form-section">
                <div class="text-h6 text-grey-7 q-mb-md">
                  <q-icon name="lock" class="q-mr-sm" />
                  Información de Solo Lectura
                  <q-chip size="sm" color="grey-3" text-color="grey-8" class="q-ml-sm">
                    No editable
                  </q-chip>
                </div>

                <q-banner class="bg-blue-1 text-blue-9 q-mb-md">
                  <template v-slot:avatar>
                    <q-icon name="info" color="blue" />
                  </template>
                  Los siguientes datos no pueden modificarse desde aquí. Para cambiar estudiante, grupo o colegio, debe crear una nueva matrícula.
                </q-banner>

                <div class="row q-col-gutter-md">
                  <!-- Estudiante (solo lectura) -->
                  <div class="col-12">
                    <q-input
                      :model-value="getStudentName()"
                      label="Estudiante"
                      filled
                      readonly
                      bg-color="grey-2"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Colegio (solo lectura) -->
                  <div class="col-12 col-md-6">
                    <q-input
                      :model-value="getSchoolName()"
                      label="Colegio"
                      filled
                      readonly
                      bg-color="grey-2"
                    >
                      <template v-slot:prepend>
                        <q-icon name="school" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Grupo (solo lectura) -->
                  <div class="col-12 col-md-6">
                    <q-input
                      :model-value="getGroupName()"
                      label="Grupo"
                      filled
                      readonly
                      bg-color="grey-2"
                    >
                      <template v-slot:prepend>
                        <q-icon name="groups" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- SECCIÓN 3: Acudientes (solo lectura) -->
              <div class="form-section">
                <div class="text-h6 text-grey-7 q-mb-md">
                  <q-icon name="supervisor_account" class="q-mr-sm" />
                  Acudientes
                  <q-chip size="sm" color="grey-3" text-color="grey-8" class="q-ml-sm">
                    No editable
                  </q-chip>
                </div>

                <q-list bordered separator v-if="originalData?.attendant && originalData.attendant.length > 0">
                  <q-item v-for="(att, index) in originalData.attendant" :key="index">
                    <q-item-section avatar>
                      <q-avatar color="grey-5" text-color="white" icon="person" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{ getAttendantName(att) }}</q-item-label>
                      <q-item-label caption>
                        Parentesco: {{ att.relationship }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-else class="text-grey-7 text-center q-pa-md">
                  Sin acudientes registrados
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="row q-mt-lg q-gutter-sm justify-end">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-8"
                  @click="goBack"
                  :disable="isSaving"
                />
                <q-btn
                  type="submit"
                  label="Guardar Cambios"
                  color="primary"
                  icon="save"
                  :loading="isSaving"
                />
              </div>

            </q-form>
          </q-card-section>

          <!-- Error -->
          <q-card-section v-else class="text-center q-pa-xl">
            <q-icon name="error_outline" size="4em" color="negative" />
            <div class="text-h6 text-negative q-mt-md">
              No se pudo cargar la información
            </div>
            <q-btn
              flat
              color="primary"
              label="Volver al listado"
              @click="goBack"
              class="q-mt-md"
            />
          </q-card-section>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotify } from '@/composables/useNotify'
import { getFullRegistrationById } from '@/services/registrationHelper'
import registrationService from '@/services/registrationService'
import Spinner from '@/components/Spinner.vue'

const router = useRouter()
const route = useRoute()
const { showNotify, showErrorNotify } = useNotify()

// Estado
const isLoading = ref(false)
const isSaving = ref(false)
const originalData = ref(null)

// Formulario (solo campos editables)
const form = ref({
  year: null,
  registrationDate: '',
  registrationNumber: '',
  description: ''
})

// Opciones
const yearOptions = ref([
  { label: '2024', value: 2024 },
  { label: '2025', value: 2025 },
  { label: '2026', value: 2026 }
])

// Funciones de formato
function getStudentName() {
  if (!originalData.value?.student) return 'N/A'
  const s = originalData.value.student
  if (typeof s === 'string') return s
  return `${s.names || ''} ${s.lastNames || ''}`.trim() || 'N/A'
}

function getSchoolName() {
  if (!originalData.value?.school) return 'N/A'
  const s = originalData.value.school
  if (typeof s === 'string') return s
  return s.name || 'N/A'
}

function getGroupName() {
  if (!originalData.value?.group) return 'N/A'
  const g = originalData.value.group
  if (typeof g === 'string') return g
  return `${g.grade || ''} ${g.level || ''}`.trim() || 'N/A'
}

function getAttendantName(att) {
  if (!att._id) return 'N/A'
  if (typeof att._id === 'string') return att._id
  return `${att._id.names || ''} ${att._id.lastNames || ''}`.trim() || 'N/A'
}

// Navegación
function goBack() {
  router.push({ name: 'Gestion_Matriculas' })
}

// Cargar datos
async function loadRegistration() {
  isLoading.value = true
  try {
    const id = route.params.id
    if (!id) {
      showErrorNotify({ message: 'ID de matrícula no proporcionado' })
      goBack()
      return
    }

    const data = await getFullRegistrationById(id)
    originalData.value = data

    // Cargar solo los campos editables en el formulario
    form.value = {
      year: data.year,
      registrationDate: data.registrationDate ? new Date(data.registrationDate).toISOString().split('T')[0] : '',
      registrationNumber: data.registrationNumber,
      description: data.description || ''
    }
    
  } catch (error) {
    console.error('Error cargando matrícula:', error)
    if (error.response?.status === 404) {
      const errorMsg = error.response?.data?.msg || 'Matrícula no encontrada'
      showErrorNotify({ message: errorMsg })
    } else if (error.response?.status !== 401) {
      const errorMsg = error.response?.data?.msg || 'Error al cargar la matrícula'
      showErrorNotify({ message: errorMsg })
    }
  } finally {
    isLoading.value = false
  }
}

// Guardar cambios
async function submitForm() {
  isSaving.value = true
  try {
    const id = route.params.id

    // Preparar datos: combinar campos editables con los no editables
    const updateData = {
      // Campos editables
      year: form.value.year,
      registrationDate: form.value.registrationDate,
      registrationNumber: form.value.registrationNumber,
      description: form.value.description,
      
      // Campos no editables (mantener originales)
      student: originalData.value.student._id || originalData.value.student,
      attendant: originalData.value.attendant,
      group: originalData.value.group._id || originalData.value.group,
      school: originalData.value.school._id || originalData.value.school
    }

    await registrationService.update(id, updateData)
    
    showNotify({ message: 'Matrícula actualizada exitosamente' })
    
    // Redirigir al listado después de 1 segundo
    setTimeout(() => {
      goBack()
    }, 1000)

  } catch (error) {
    console.error('Error actualizando matrícula:', error)
    const errorMsg = error.response?.data?.msg || 'Error al actualizar la matrícula'
    showErrorNotify({ message: errorMsg })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadRegistration()
})
</script>

<style scoped>
.shadow1 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.form-section {
  margin-bottom: 24px;
}
</style>
