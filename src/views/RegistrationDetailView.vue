<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        
        <!-- Header con botones de acción -->
        <div class="row items-center q-mb-md">
          <div class="col">
            <div class="text-h5 text-weight-medium">
              <q-icon name="assignment" class="q-mr-sm" />
              Detalles de Matrícula
            </div>
            <div class="text-caption text-grey-7">
              Información completa de la matrícula
            </div>
          </div>
          <div class="col-auto q-gutter-sm">
            <q-btn
              flat
              color="grey-8"
              icon="arrow_back"
              label="Volver"
              @click="goBack"
            />
            <q-btn
              color="primary"
              icon="edit"
              label="Editar"
              @click="goToEdit"
              v-if="registration && registration.state !== 'GRADUADO'"
            />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center q-pa-xl">
          <Spinner size="50px" />
          <div class="text-caption q-mt-md">Cargando información...</div>
        </div>

        <!-- Contenido -->
        <div v-else-if="registration">
          
          <!-- Información General -->
          <q-card class="shadow1 q-mb-md">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">
                <q-icon name="info" class="q-mr-sm" />
                Información General
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Número de Matrícula</div>
                  <div class="text-body1 text-weight-medium">
                    {{ registration.registrationNumber }}
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Estado</div>
                  <q-chip 
                    :color="getStateColor(registration.state)" 
                    text-color="white"
                  >
                    {{ registration.state }}
                  </q-chip>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Año</div>
                  <div class="text-body1">{{ registration.year }}</div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Fecha de Matrícula</div>
                  <div class="text-body1">{{ formatDate(registration.registrationDate) }}</div>
                </div>

                <div class="col-12">
                  <div class="text-caption text-grey-7">Descripción</div>
                  <div class="text-body1">{{ registration.description || 'Sin descripción' }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Estudiante -->
          <q-card class="shadow1 q-mb-md">
            <q-card-section class="bg-blue-1">
              <div class="text-h6 text-primary">
                <q-icon name="person" class="q-mr-sm" />
                Estudiante
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Nombres</div>
                  <div class="text-body1 text-weight-medium">
                    {{ getStudentName() }}
                  </div>
                </div>

                <div class="col-12 col-md-6" v-if="registration.student?.numberDocument">
                  <div class="text-caption text-grey-7">Documento</div>
                  <div class="text-body1">{{ registration.student.numberDocument }}</div>
                </div>

                <div class="col-12 col-md-6" v-if="registration.student?.email">
                  <div class="text-caption text-grey-7">Email</div>
                  <div class="text-body1">{{ registration.student.email }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Acudientes -->
          <q-card class="shadow1 q-mb-md" v-if="registration.attendant && registration.attendant.length > 0">
            <q-card-section class="bg-orange-1">
              <div class="text-h6 text-orange-9">
                <q-icon name="supervisor_account" class="q-mr-sm" />
                Acudientes ({{ registration.attendant.length }})
              </div>
            </q-card-section>

            <q-separator />

            <q-list separator>
              <q-item v-for="(att, index) in registration.attendant" :key="index">
                <q-item-section avatar>
                  <q-avatar color="orange" text-color="white" icon="person" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ getAttendantName(att) }}
                  </q-item-label>
                  <q-item-label caption>
                    Parentesco: {{ att.relationship }}
                  </q-item-label>
                  <q-item-label caption v-if="att._id?.numberDocument">
                    Doc: {{ att._id.numberDocument }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side v-if="att._id?.email">
                  <q-item-label caption>
                    <q-icon name="email" size="xs" class="q-mr-xs" />
                    {{ att._id.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <!-- Grupo y Colegio -->
          <q-card class="shadow1 q-mb-md">
            <q-card-section class="bg-green-1">
              <div class="text-h6 text-green-9">
                <q-icon name="school" class="q-mr-sm" />
                Información Académica
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Colegio</div>
                  <div class="text-body1 text-weight-medium">
                    {{ getSchoolName() }}
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Grupo</div>
                  <div class="text-body1 text-weight-medium">
                    {{ getGroupName() }}
                  </div>
                </div>

                <div class="col-12 col-md-6" v-if="registration.group?.level">
                  <div class="text-caption text-grey-7">Nivel</div>
                  <div class="text-body1">{{ registration.group.level }}</div>
                </div>

                <div class="col-12 col-md-6" v-if="registration.group?.grade">
                  <div class="text-caption text-grey-7">Grado</div>
                  <div class="text-body1">{{ registration.group.grade }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Promedios (si existen) -->
          <q-card class="shadow1 q-mb-md" v-if="hasAverages()">
            <q-card-section class="bg-purple-1">
              <div class="text-h6 text-purple-9">
                <q-icon name="assessment" class="q-mr-sm" />
                Promedios por Período
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-6 col-md-3" v-if="registration.averagePeriod1 > 0">
                  <div class="text-caption text-grey-7">Período 1</div>
                  <div class="text-h6 text-primary">{{ registration.averagePeriod1.toFixed(2) }}</div>
                </div>

                <div class="col-6 col-md-3" v-if="registration.averagePeriod2 > 0">
                  <div class="text-caption text-grey-7">Período 2</div>
                  <div class="text-h6 text-primary">{{ registration.averagePeriod2.toFixed(2) }}</div>
                </div>

                <div class="col-6 col-md-3" v-if="registration.averagePeriod3 > 0">
                  <div class="text-caption text-grey-7">Período 3</div>
                  <div class="text-h6 text-primary">{{ registration.averagePeriod3.toFixed(2) }}</div>
                </div>

                <div class="col-6 col-md-3" v-if="registration.averagePeriod4 > 0">
                  <div class="text-caption text-grey-7">Período 4</div>
                  <div class="text-h6 text-primary">{{ registration.averagePeriod4.toFixed(2) }}</div>
                </div>

                <div class="col-12" v-if="registration.averageGeneralPeriod > 0">
                  <q-separator class="q-my-md" />
                  <div class="text-caption text-grey-7">Promedio General</div>
                  <div class="text-h5 text-positive text-weight-bold">
                    {{ registration.averageGeneralPeriod.toFixed(2) }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

        </div>

        <!-- Error -->
        <div v-else class="text-center q-pa-xl">
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
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotify } from '@/composables/useNotify'
import { getFullRegistrationById } from '@/services/registrationHelper'
import Spinner from '@/components/Spinner.vue'

const router = useRouter()
const route = useRoute()
const { showErrorNotify } = useNotify()

const isLoading = ref(false)
const registration = ref(null)

// Funciones de formato
function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getStateColor(state) {
  const colors = {
    'ACTIVO': 'positive',
    'RETIRADO': 'warning',
    'DESERTADO': 'negative',
    'GRADUADO': 'info'
  }
  return colors[state] || 'grey'
}

function getStudentName() {
  if (!registration.value?.student) return 'N/A'
  const s = registration.value.student
  if (typeof s === 'string') return s
  return `${s.names || ''} ${s.lastNames || ''}`.trim() || 'N/A'
}

function getAttendantName(att) {
  if (!att._id) return 'N/A'
  if (typeof att._id === 'string') return att._id
  return `${att._id.names || ''} ${att._id.lastNames || ''}`.trim() || 'N/A'
}

function getSchoolName() {
  if (!registration.value?.school) return 'N/A'
  const s = registration.value.school
  if (typeof s === 'string') return s
  return s.name || 'N/A'
}

function getGroupName() {
  if (!registration.value?.group) return 'N/A'
  const g = registration.value.group
  if (typeof g === 'string') return g
  return `${g.grade || ''} ${g.level || ''}`.trim() || 'N/A'
}

function hasAverages() {
  if (!registration.value) return false
  return registration.value.averagePeriod1 > 0 ||
         registration.value.averagePeriod2 > 0 ||
         registration.value.averagePeriod3 > 0 ||
         registration.value.averagePeriod4 > 0 ||
         registration.value.averageGeneralPeriod > 0
}

// Navegación
function goBack() {
  router.push({ name: 'Gestion_Matriculas' })
}

function goToEdit() {
  if (registration.value?._id) {
    router.push({ 
      name: 'Editar_Matricula', 
      params: { id: registration.value._id } 
    })
  }
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
    registration.value = data
    
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

onMounted(() => {
  loadRegistration()
})
</script>

<style scoped>
.shadow1 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>