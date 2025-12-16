<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <section class="col-12">
        <q-card class="shadow1">
          <q-card-section>
            <!-- Loading spinner -->
            <div v-if="isLoading" class="text-center q-pa-xl">
              <Spinner size="50px" />
              <div class="text-caption q-mt-md">Cargando matrículas...</div>
            </div>

            <!-- Header -->
            <div v-else>
              <div class="row items-center q-mb-lg">
                <q-card-section class="pageHeaderInfo">
                  <div class="text-h5 text-weight-bold">
                    Gestión de Matrículas
                  </div>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    Administrar las matrículas de los estudiantes
                  </div>
                </q-card-section>

                <q-space />
                
                <div class="actionButtonContainer">
                  <q-btn 
                    color="primary" 
                    icon="add" 
                    label="Nueva Matrícula" 
                    @click="goToCreate"
                  />
                </div>
              </div>

              <!-- Filtros -->
              <div class="row q-mb-md q-gutter-sm">
                <!-- Filtro por año -->
                <q-select
                  v-model="filterYear"
                  :options="yearOptions"
                  label="Filtrar por año"
                  outlined
                  dense
                  emit-value
                  map-options
                  style="min-width: 150px"
                  @update:model-value="loadRegistrations"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-select>

                <!-- Filtro por estado -->
                <q-select
                  v-model="filterState"
                  :options="stateOptions"
                  label="Filtrar por estado"
                  outlined
                  dense
                  clearable
                  emit-value
                  map-options
                  style="min-width: 180px"
                >
                  <template v-slot:prepend>
                    <q-icon name="tune" />
                  </template>
                </q-select>

                <q-space />

                <!-- Contador de registros -->
                <div class="text-caption text-grey-7 self-center">
                  Total: <strong>{{ filteredRows.length }}</strong> matrículas
                </div>
              </div>

              <!-- Tabla -->
              <Table 
                v-if="registrations.length > 0" 
                :rows="filteredRows" 
                :columns="columns" 
                :actions="true"
                row-key="_id"
              >
                <!-- Columna personalizada: Estudiante -->
                <template v-slot:body-cell-student="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">
                      {{ getFullName(props.row.student) }}
                    </div>
                    <div class="text-caption text-grey-7">
                      Doc: {{ props.row.student?.numberDocument || 'N/A' }}
                    </div>
                  </q-td>
                </template>

                <!-- Columna personalizada: Grupo -->
                <template v-slot:body-cell-group="props">
                  <q-td :props="props">
                    <q-chip 
                      color="blue-1" 
                      text-color="blue-8"
                      dense
                      icon="school"
                    >
                      {{ getGroupLabel(props.row.group) }}
                    </q-chip>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      {{ props.row.group?.session || 'N/A' }}
                    </div>
                  </q-td>
                </template>

                <!-- Columna personalizada: Estado -->
                <template v-slot:body-cell-state="props">
                  <q-td :props="props">
                    <q-chip 
                      :color="getStateColor(props.value)" 
                      text-color="white" 
                      dense
                    >
                      {{ props.value }}
                    </q-chip>
                  </q-td>
                </template>

                <!-- Columna personalizada: Fecha -->
                <template v-slot:body-cell-registrationDate="props">
                  <q-td :props="props">
                    {{ formatDate(props.value) }}
                  </q-td>
                </template>

                <!-- Columna personalizada: Acciones -->
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <div class="q-gutter-xs">
                      <!-- Ver detalles -->
                      <q-btn 
                        flat 
                        dense 
                        round 
                        color="primary" 
                        icon="visibility"
                        size="sm"
                        @click="viewDetails(props.row)"
                      >
                        <q-tooltip>Ver detalles</q-tooltip>
                      </q-btn>

                      <!-- Editar -->
                      <q-btn 
                        flat 
                        dense 
                        round 
                        color="blue" 
                        icon="edit"
                        size="sm"
                        @click="editRegistration(props.row)"
                      >
                        <q-tooltip>Editar</q-tooltip>
                      </q-btn>

                      <!-- Cambiar estado -->
                      <q-btn 
                        flat 
                        dense 
                        round 
                        color="orange" 
                        icon="swap_horiz"
                        size="sm"
                      >
                        <q-tooltip>Cambiar estado</q-tooltip>
                        <q-menu>
                          <q-list style="min-width: 150px">
                            <q-item 
                              clickable 
                              v-close-popup
                              @click="changeState(props.row, 'ACTIVO')"
                              :disable="props.row.state === 'ACTIVO'"
                            >
                              <q-item-section avatar>
                                <q-icon name="check_circle" color="positive" />
                              </q-item-section>
                              <q-item-section>Activar</q-item-section>
                            </q-item>

                            <q-item 
                              clickable 
                              v-close-popup
                              @click="changeState(props.row, 'RETIRADO')"
                              :disable="props.row.state === 'RETIRADO'"
                            >
                              <q-item-section avatar>
                                <q-icon name="logout" color="warning" />
                              </q-item-section>
                              <q-item-section>Retirar</q-item-section>
                            </q-item>

                            <q-item 
                              clickable 
                              v-close-popup
                              @click="changeState(props.row, 'DESERTADO')"
                              :disable="props.row.state === 'DESERTADO'"
                            >
                              <q-item-section avatar>
                                <q-icon name="cancel" color="negative" />
                              </q-item-section>
                              <q-item-section>Deserción</q-item-section>
                            </q-item>

                            <q-item 
                              clickable 
                              v-close-popup
                              @click="changeState(props.row, 'GRADUADO')"
                              :disable="props.row.state === 'GRADUADO'"
                            >
                              <q-item-section avatar>
                                <q-icon name="school" color="info" />
                              </q-item-section>
                              <q-item-section>Graduado</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </q-td>
                </template>

                <!-- Sin datos -->
                <template v-slot:no-data>
                  <div class="text-center q-pa-md">
                    <q-icon name="inbox" size="3em" color="grey-5" />
                    <div class="text-grey-7 q-mt-sm">
                      No se encontraron matrículas para el año {{ filterYear }}
                    </div>
                  </div>
                </template>
              </Table>

              <!-- Mensaje cuando no hay datos -->
              <div v-else class="text-center q-pa-xl">
                <q-icon name="inbox" size="4em" color="grey-5" />
                <div class="text-h6 text-grey-7 q-mt-md">
                  No hay matrículas registradas
                </div>
                <q-btn 
                  color="primary" 
                  label="Crear primera matrícula" 
                  icon="add"
                  class="q-mt-md"
                  @click="goToCreate"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </section>
    </div>

    <!-- Modal de Detalles -->
    <q-dialog v-model="showDetailModal" persistent>
      <q-card style="min-width: 700px; max-width: 90vw; max-height: 90vh;">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">
            <q-icon name="assignment" class="q-mr-sm" />
            Detalles de la Matrícula
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="loadingDetail" class="text-center q-pa-xl">
          <Spinner size="50px" />
          <div class="text-caption q-mt-md">Cargando detalles...</div>
        </q-card-section>

        <q-card-section v-else-if="selectedRegistration" class="q-pa-md" style="max-height: calc(90vh - 150px); overflow-y: auto;">
          
          <!-- Información General -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-primary q-mb-sm">
              <q-icon name="info" class="q-mr-xs" />
              Información General
            </div>
            <q-separator class="q-mb-sm" />
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7">Número de Matrícula</div>
                <div class="text-body1 text-weight-medium">
                  {{ selectedRegistration.registrationNumber || 'N/A' }}
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7">Estado</div>
                <q-chip 
                  :color="getStateColor(selectedRegistration.state)" 
                  text-color="white"
                  size="sm"
                >
                  {{ selectedRegistration.state || 'N/A' }}
                </q-chip>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7">Año</div>
                <div class="text-body1">{{ selectedRegistration.year || 'N/A' }}</div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7">Fecha de Matrícula</div>
                <div class="text-body1">{{ formatDate(selectedRegistration.registrationDate) }}</div>
              </div>
              <div class="col-12">
                <div class="text-caption text-grey-7">Descripción</div>
                <div class="text-body1">{{ selectedRegistration.description || 'Sin descripción' }}</div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Información del Estudiante -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-primary q-mb-sm">
              <q-icon name="person" class="q-mr-xs" />
              Estudiante
            </div>
            <q-separator class="q-mb-sm" />
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7">Nombre Completo</div>
                <div class="text-body1 text-weight-medium">
                  {{ getFullName(selectedRegistration.student) }}
                </div>
              </div>
              <div class="col-12 col-md-6" v-if="selectedRegistration.student?.numberDocument">
                <div class="text-caption text-grey-7">Documento</div>
                <div class="text-body1">{{ selectedRegistration.student.numberDocument }}</div>
              </div>
              <div class="col-12 col-md-6" v-if="selectedRegistration.student?.email">
                <div class="text-caption text-grey-7">Email</div>
                <div class="text-body1">{{ selectedRegistration.student.email }}</div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Acudientes -->
          <div class="q-mb-md" v-if="selectedRegistration.attendant && selectedRegistration.attendant.length > 0">
            <div class="text-subtitle2 text-primary q-mb-sm">
              <q-icon name="supervisor_account" class="q-mr-xs" />
              Acudientes ({{ selectedRegistration.attendant.length }})
            </div>
            <q-separator class="q-mb-sm" />
            <q-list separator bordered class="rounded-borders">
              <q-item v-for="(att, index) in selectedRegistration.attendant" :key="index">
                <q-item-section avatar>
                  <q-avatar color="orange" text-color="white" icon="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ getFullName(att._id) }}
                  </q-item-label>
                  <q-item-label caption>
                    Parentesco: {{ att.relationship || 'N/A' }}
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
          </div>

          <q-separator class="q-my-md" />

          <!-- Información Académica -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-primary q-mb-sm">
              <q-icon name="school" class="q-mr-xs" />
              Información Académica
            </div>
            <q-separator class="q-mb-sm" />
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7">Colegio</div>
                <div class="text-body1 text-weight-medium">
                  {{ getSchoolName(selectedRegistration.school) }}
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-caption text-grey-7">Grupo</div>
                <div class="text-body1 text-weight-medium">
                  {{ getGroupName(selectedRegistration.group) }}
                </div>
              </div>
              <div class="col-12 col-md-6" v-if="selectedRegistration.group?.level">
                <div class="text-caption text-grey-7">Nivel</div>
                <div class="text-body1">{{ selectedRegistration.group.level }}</div>
              </div>
              <div class="col-12 col-md-6" v-if="selectedRegistration.group?.grade">
                <div class="text-caption text-grey-7">Grado</div>
                <div class="text-body1">{{ selectedRegistration.group.grade }}</div>
              </div>
            </div>
          </div>

          <!-- Promedios (si existen) -->
          <div v-if="hasAverages(selectedRegistration)">
            <q-separator class="q-my-md" />
            <div class="q-mb-md">
              <div class="text-subtitle2 text-primary q-mb-sm">
                <q-icon name="assessment" class="q-mr-xs" />
                Promedios por Período
              </div>
              <q-separator class="q-mb-sm" />
              <div class="row q-col-gutter-md">
                <div class="col-6 col-md-3" v-if="selectedRegistration.averagePeriod1 > 0">
                  <div class="text-caption text-grey-7">Período 1</div>
                  <div class="text-h6 text-primary">{{ selectedRegistration.averagePeriod1.toFixed(2) }}</div>
                </div>
                <div class="col-6 col-md-3" v-if="selectedRegistration.averagePeriod2 > 0">
                  <div class="text-caption text-grey-7">Período 2</div>
                  <div class="text-h6 text-primary">{{ selectedRegistration.averagePeriod2.toFixed(2) }}</div>
                </div>
                <div class="col-6 col-md-3" v-if="selectedRegistration.averagePeriod3 > 0">
                  <div class="text-caption text-grey-7">Período 3</div>
                  <div class="text-h6 text-primary">{{ selectedRegistration.averagePeriod3.toFixed(2) }}</div>
                </div>
                <div class="col-6 col-md-3" v-if="selectedRegistration.averagePeriod4 > 0">
                  <div class="text-caption text-grey-7">Período 4</div>
                  <div class="text-h6 text-primary">{{ selectedRegistration.averagePeriod4.toFixed(2) }}</div>
                </div>
                <div class="col-12" v-if="selectedRegistration.averageGeneralPeriod > 0">
                  <q-separator class="q-my-md" />
                  <div class="text-caption text-grey-7">Promedio General</div>
                  <div class="text-h5 text-positive text-weight-bold">
                    {{ selectedRegistration.averageGeneralPeriod.toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn 
            flat 
            label="Cerrar" 
            color="grey-8" 
            v-close-popup 
          />
          <q-btn 
            label="Editar" 
            color="primary" 
            icon="edit"
            @click="editFromModal"
            v-if="selectedRegistration && selectedRegistration.state !== 'GRADUADO'"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Table from '@/components/tables.vue'
import Spinner from '@/components/Spinner.vue'
import { useNotify } from '@/composables/useNotify'
import registrationService from '@/services/registrationService'
import { getFullRegistrationsByYear, getFullRegistrationById, getFullName, getGroupLabel, getStateColor } from '@/services/registrationHelper'

const router = useRouter()
const { showNotify, showErrorNotify } = useNotify()

// Estado
const isLoading = ref(false)
const registrations = ref([])
const filterYear = ref(new Date().getFullYear())
const filterState = ref(null)
const showDetailModal = ref(false)
const selectedRegistration = ref(null)
const loadingDetail = ref(false)
// Opciones de filtros
const yearOptions = [
  { label: '2023', value: 2023 },
  { label: '2024', value: 2024 },
  { label: '2025', value: 2025 },
  { label: '2026', value: 2026 }
]

const stateOptions = [
  { label: 'Todos', value: null },
  { label: 'Activo', value: 'ACTIVO' },
  { label: 'Retirado', value: 'RETIRADO' },
  { label: 'Desertado', value: 'DESERTADO' },
  { label: 'Graduado', value: 'GRADUADO' }
]

// Columnas de la tabla
const columns = [
  { 
    name: 'student', 
    label: 'Estudiante', 
    field: row => getFullName(row.student), 
    align: 'left',
    sortable: true
  },
  { 
    name: 'registrationNumber', 
    label: 'N° Matrícula', 
    field: 'registrationNumber', 
    align: 'center',
    sortable: true
  },
  { 
    name: 'group', 
    label: 'Grupo', 
    field: row => getGroupLabel(row.group), 
    align: 'center',
    sortable: true
  },
  { 
    name: 'state', 
    label: 'Estado', 
    field: 'state', 
    align: 'center',
    sortable: true
  },
  { 
    name: 'year', 
    label: 'Año', 
    field: 'year', 
    align: 'center',
    sortable: true
  },
  { 
    name: 'registrationDate', 
    label: 'Fecha Matrícula', 
    field: 'registrationDate', 
    align: 'center',
    sortable: true
  },
  { 
    name: 'actions', 
    label: 'Acciones', 
    field: 'actions', 
    align: 'center'
  }
]

// Computed: Filas filtradas
const filteredRows = computed(() => {
  let rows = registrations.value

  // Filtrar por estado si está seleccionado
  if (filterState.value) {
    rows = rows.filter(reg => reg.state === filterState.value)
  }

  return rows
})

// Funciones
async function loadRegistrations() {
  isLoading.value = true
  try {
    // Usar el helper para obtener datos completos con populates
    const data = await getFullRegistrationsByYear(filterYear.value)
    registrations.value = data
    
    if (data.length > 0) {
      showNotify({ message: `${data.length} matrículas cargadas correctamente` })
    }
  } catch (error) {
    if (error.response?.status === 401) {
      showErrorNotify({ message: 'Sesión expirada. Por favor inicia sesión nuevamente' })
      localStorage.removeItem('token')
      setTimeout(() => router.push('/'), 1000)
    } else {
      console.error('Error cargando matrículas:', error)
      const errorMsg = error.response?.data?.msg || 'Error al cargar las matrículas'
      showErrorNotify({ message: errorMsg })
    }
    registrations.value = []
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function getSchoolName(school) {
  if (!school) return 'N/A'
  if (typeof school === 'string') return school
  return school.name || 'N/A'
}

function getGroupName(group) {
  if (!group) return 'N/A'
  if (typeof group === 'string') return group
  return `${group.grade || ''} ${group.level || ''}`.trim() || 'N/A'
}

function hasAverages(registration) {
  if (!registration) return false
  return registration.averagePeriod1 > 0 ||
         registration.averagePeriod2 > 0 ||
         registration.averagePeriod3 > 0 ||
         registration.averagePeriod4 > 0 ||
         registration.averageGeneralPeriod > 0
}

async function viewDetails(row) {
  loadingDetail.value = true
  showDetailModal.value = true
  try {
    const data = await getFullRegistrationById(row._id)
    selectedRegistration.value = data
  } catch (error) {
    console.error('Error cargando detalle:', error)
    showErrorNotify({ message: 'Error al cargar los detalles' })
    showDetailModal.value = false
  } finally {
    loadingDetail.value = false
  }
}

function editRegistration(row) {
  router.push({ name: 'Editar_Matricula', params: { id: row._id } })
}

function editFromModal() {
  if (selectedRegistration.value?._id) {
    showDetailModal.value = false
    router.push({ name: 'Editar_Matricula', params: { id: selectedRegistration.value._id } })
  }
}

function goToCreate() {
  router.push({ name: 'Crear_Matricula' })
}

async function changeState(row, newState) {
  isLoading.value = true
  try {
    let response
    
    switch (newState) {
      case 'ACTIVO':
        response = await registrationService.activate(row._id)
        break
      case 'RETIRADO':
        response = await registrationService.desactivate(row._id)
        break
      case 'DESERTADO':
        response = await registrationService.desertion(row._id)
        break
      case 'GRADUADO':
        response = await registrationService.graduated(row._id)
        break
      default:
        throw new Error('Estado no válido')
    }

    showNotify({ message: `Estado cambiado a ${newState}` })
    
    // Recargar las matrículas
    await loadRegistrations()
    
  } catch (error) {
    console.error('Error cambiando estado:', error)
    const errorMsg = error.response?.data?.msg || 'Error al cambiar el estado de la matrícula'
    showErrorNotify({ message: errorMsg })
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadRegistrations()
})
</script>

<style scoped>
.pageHeaderInfo {
  padding: 0;
}

.actionButtonContainer {
  padding-right: 16px;
}

.shadow1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
</style>
