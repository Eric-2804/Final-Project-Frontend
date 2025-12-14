<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">🧪 Pruebas de API - Matrículas</div>
    <div class="text-caption text-grey-7 q-mb-lg">
      Vista temporal para verificar endpoints del backend en Render
    </div>

    <!-- Panel de Control -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Panel de Control</div>
        <div class="q-gutter-sm q-mt-md">
          <q-input 
            v-model="testYear" 
            label="Año para pruebas" 
            type="number" 
            style="max-width: 200px"
            hint="Default: 2024"
          />
          <q-input 
            v-model="testId" 
            label="ID de prueba (matrícula/estudiante)" 
            style="max-width: 400px"
            hint="Pegar un ID válido del sistema"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- SECCIÓN 1: ENDPOINTS DE MATRÍCULAS -->
    <q-expansion-item
      v-model="expanded.registrations"
      icon="assignment"
      label="📋 ENDPOINTS DE MATRÍCULAS"
      header-class="bg-primary text-white"
      class="q-mb-md shadow-2"
    >
      <q-card>
        <q-card-section>
          <div class="q-gutter-md">
            
            <!-- Test: Listar por año -->
            <q-card flat bordered>
              <q-card-section class="bg-grey-2">
                <div class="text-weight-bold">GET /api/matriculas/year/:year</div>
                <div class="text-caption">Listar matrículas por año</div>
              </q-card-section>
              <q-card-section>
                <q-btn 
                  color="primary" 
                  label="Probar" 
                  @click="testGetByYear"
                  :loading="loading.getByYear"
                />
                <div v-if="results.getByYear" class="q-mt-md">
                  <div class="text-weight-bold">Resultado:</div>
                  <q-badge :color="results.getByYear.success ? 'positive' : 'negative'">
                    {{ results.getByYear.success ? '✅ SUCCESS' : '❌ ERROR' }}
                  </q-badge>
                  <pre class="result-box">{{ JSON.stringify(results.getByYear.data, null, 2) }}</pre>
                </div>
              </q-card-section>
            </q-card>

            <!-- Test: Obtener por ID -->
            <q-card flat bordered>
              <q-card-section class="bg-grey-2">
                <div class="text-weight-bold">GET /api/matriculas/:id</div>
                <div class="text-caption">Obtener matrícula por ID</div>
              </q-card-section>
              <q-card-section>
                <q-btn 
                  color="primary" 
                  label="Probar" 
                  @click="testGetById"
                  :loading="loading.getById"
                  :disable="!testId"
                />
                <div v-if="results.getById" class="q-mt-md">
                  <div class="text-weight-bold">Resultado:</div>
                  <q-badge :color="results.getById.success ? 'positive' : 'negative'">
                    {{ results.getById.success ? '✅ SUCCESS' : '❌ ERROR' }}
                  </q-badge>
                  <pre class="result-box">{{ JSON.stringify(results.getById.data, null, 2) }}</pre>
                </div>
              </q-card-section>
            </q-card>

            <!-- Test: Por Grupo -->
            <q-card flat bordered>
              <q-card-section class="bg-grey-2">
                <div class="text-weight-bold">GET /api/matriculas/groups/:groupId/registrations</div>
                <div class="text-caption">Obtener matrículas por grupo</div>
              </q-card-section>
              <q-card-section>
                <q-btn 
                  color="primary" 
                  label="Probar" 
                  @click="testGetByGroup"
                  :loading="loading.getByGroup"
                  :disable="!testId"
                />
                <div v-if="results.getByGroup" class="q-mt-md">
                  <div class="text-weight-bold">Resultado:</div>
                  <q-badge :color="results.getByGroup.success ? 'positive' : 'negative'">
                    {{ results.getByGroup.success ? '✅ SUCCESS' : '❌ ERROR' }}
                  </q-badge>
                  <pre class="result-box">{{ JSON.stringify(results.getByGroup.data, null, 2) }}</pre>
                </div>
              </q-card-section>
            </q-card>

            <!-- Test: Por Estudiante -->
            <q-card flat bordered>
              <q-card-section class="bg-grey-2">
                <div class="text-weight-bold">GET /api/matriculas/student/:studentId/registrations</div>
                <div class="text-caption">Obtener matrículas por estudiante</div>
              </q-card-section>
              <q-card-section>
                <q-btn 
                  color="primary" 
                  label="Probar" 
                  @click="testGetByStudent"
                  :loading="loading.getByStudent"
                  :disable="!testId"
                />
                <div v-if="results.getByStudent" class="q-mt-md">
                  <div class="text-weight-bold">Resultado:</div>
                  <q-badge :color="results.getByStudent.success ? 'positive' : 'negative'">
                    {{ results.getByStudent.success ? '✅ SUCCESS' : '❌ ERROR' }}
                  </q-badge>
                  <pre class="result-box">{{ JSON.stringify(results.getByStudent.data, null, 2) }}</pre>
                </div>
              </q-card-section>
            </q-card>

          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- SECCIÓN 2: ENDPOINTS DE ACUDIENTES -->
    <q-expansion-item
      v-model="expanded.attendants"
      icon="supervisor_account"
      label="👨‍👩‍👧 ENDPOINTS DE ACUDIENTES"
      header-class="bg-secondary text-white"
      class="q-mb-md shadow-2"
    >
      <q-card>
        <q-card-section>
          <div class="q-gutter-md">
            
            <!-- Test: Obtener acudiente por ID -->
            <q-card flat bordered>
              <q-card-section class="bg-grey-2">
                <div class="text-weight-bold">GET /api/matriculas/attendant/:attendantId/registration</div>
                <div class="text-caption">Obtener acudiente por ID</div>
              </q-card-section>
              <q-card-section>
                <q-btn 
                  color="secondary" 
                  label="Probar" 
                  @click="testGetAttendantById"
                  :loading="loading.getAttendantById"
                  :disable="!testId"
                />
                <div v-if="results.getAttendantById" class="q-mt-md">
                  <div class="text-weight-bold">Resultado:</div>
                  <q-badge :color="results.getAttendantById.success ? 'positive' : 'negative'">
                    {{ results.getAttendantById.success ? '✅ SUCCESS' : '❌ ERROR' }}
                  </q-badge>
                  <pre class="result-box">{{ JSON.stringify(results.getAttendantById.data, null, 2) }}</pre>
                </div>
              </q-card-section>
            </q-card>

          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- SECCIÓN 3: PRUEBA DEL HELPER -->
    <q-expansion-item
      v-model="expanded.helper"
      icon="build"
      label="🔧 PRUEBA DEL HELPER (Con Populate Manual)"
      header-class="bg-positive text-white"
      class="q-mb-md shadow-2"
    >
      <q-card>
        <q-card-section>
          <div class="text-body2 q-mb-md">
            El helper hace peticiones adicionales para obtener datos completos (populate manual).
            Compara los resultados con los endpoints normales arriba.
          </div>

          <div class="q-gutter-md">
            
            <!-- Test: Helper getFullRegistrationById -->
            <q-card flat bordered>
              <q-card-section class="bg-grey-2">
                <div class="text-weight-bold">🔧 Helper: getFullRegistrationById(id)</div>
                <div class="text-caption">Obtiene matrícula CON datos completos</div>
              </q-card-section>
              <q-card-section>
                <q-btn 
                  color="positive" 
                  label="Probar Helper" 
                  @click="testHelper"
                  :loading="loading.helper"
                  :disable="!testId"
                />
                <div v-if="results.helper" class="q-mt-md">
                  <div class="text-weight-bold">Resultado:</div>
                  <q-badge :color="results.helper.success ? 'positive' : 'negative'">
                    {{ results.helper.success ? '✅ SUCCESS' : '❌ ERROR' }}
                  </q-badge>
                  
                  <!-- Comparación visual -->
                  <div v-if="results.helper.success && results.helper.data" class="q-mt-md">
                    <q-banner class="bg-green-1 text-green-9">
                      <template v-slot:avatar>
                        <q-icon name="check_circle" color="positive" />
                      </template>
                      <div class="text-weight-bold">¡Datos poblados correctamente!</div>
                      <div class="q-mt-sm">
                        <div>👤 Estudiante: {{ results.helper.data.student?.names }} {{ results.helper.data.student?.lastNames }}</div>
                        <div>📚 Grupo: {{ results.helper.data.group?.level }} {{ results.helper.data.group?.grade }}</div>
                        <div>🏫 Colegio: {{ results.helper.data.school?.name || 'N/A' }}</div>
                        <div v-if="results.helper.data.attendant && results.helper.data.attendant.length > 0">
                          👨‍👩‍👧 Acudientes: 
                          <span v-for="(att, idx) in results.helper.data.attendant" :key="idx">
                            {{ att._id?.names || 'N/A' }} ({{ att.relationship }}){{ idx < results.helper.data.attendant.length - 1 ? ', ' : '' }}
                          </span>
                        </div>
                      </div>
                    </q-banner>
                  </div>
                  
                  <pre class="result-box">{{ JSON.stringify(results.helper.data, null, 2) }}</pre>
                </div>
              </q-card-section>
            </q-card>

          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- RESUMEN DE PRUEBAS -->
    <q-card flat bordered class="q-mt-md">
      <q-card-section class="bg-info text-white">
        <div class="text-h6">📊 Resumen de Pruebas</div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-sm">
          <div><strong>Total ejecutadas:</strong> {{ totalTests }}</div>
          <div><strong>Exitosas:</strong> <span class="text-positive">{{ successTests }}</span></div>
          <div><strong>Fallidas:</strong> <span class="text-negative">{{ failedTests }}</span></div>
        </div>
        
        <q-separator class="q-my-md" />
        
        <div class="text-subtitle2 q-mb-sm">Validación de Populates:</div>
        <div v-if="populateChecks.length > 0">
          <div v-for="check in populateChecks" :key="check.endpoint" class="q-mb-sm">
            <q-badge :color="check.populated ? 'positive' : 'warning'">
              {{ check.endpoint }}
            </q-badge>
            <span class="q-ml-sm text-caption">
              {{ check.populated ? '✅ Popula correctamente' : '⚠️ Sin datos poblados o error' }}
            </span>
          </div>
        </div>
        <div v-else class="text-grey-7 text-caption">
          Ejecuta pruebas para ver validación de populates
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import registrationService from '../services/registrationService.js'
import { getFullRegistrationById } from '../services/registrationHelper.js'
import { useNotify } from '../composables/useNotify.js'

const { showNotify, showErrorNotify } = useNotify()

// Estado
const testYear = ref(2024)
const testId = ref('')

const expanded = ref({
  registrations: true,
  attendants: false,
  helper: false
})

const loading = ref({
  getByYear: false,
  getById: false,
  getByGroup: false,
  getByStudent: false,
  getAttendantById: false,
  helper: false
})

const results = ref({
  getByYear: null,
  getById: null,
  getByGroup: null,
  getByStudent: null,
  getAttendantById: null,
  helper: null
})

const populateChecks = ref([])

// Computados
const totalTests = computed(() => {
  return Object.values(results.value).filter(r => r !== null).length
})

const successTests = computed(() => {
  return Object.values(results.value).filter(r => r && r.success).length
})

const failedTests = computed(() => {
  return Object.values(results.value).filter(r => r && !r.success).length
})

// Funciones de prueba
async function testGetByYear() {
  loading.value.getByYear = true
  try {
    const response = await registrationService.getAllByYear(testYear.value)
    results.value.getByYear = {
      success: true,
      data: response.data,
      message: `${response.data?.data?.length || 0} matrículas encontradas`
    }
    
    // Verificar populate
    checkPopulate('GET /year/:year', response.data?.data)
    
    showNotify('✅ Endpoint funcionando correctamente')
  } catch (error) {
    results.value.getByYear = {
      success: false,
      data: error.response?.data || error.message,
      message: 'Error en la petición'
    }
    showErrorNotify('❌ Error: ' + (error.response?.data?.msg || error.message))
  } finally {
    loading.value.getByYear = false
  }
}

async function testGetById() {
  loading.value.getById = true
  try {
    const response = await registrationService.getById(testId.value)
    results.value.getById = {
      success: true,
      data: response.data
    }
    
    // Verificar populate
    checkPopulate('GET /:id', [response.data?.data])
    
    showNotify('✅ Endpoint funcionando correctamente')
  } catch (error) {
    results.value.getById = {
      success: false,
      data: error.response?.data || error.message
    }
    showErrorNotify('❌ Error: ' + (error.response?.data?.msg || error.message))
  } finally {
    loading.value.getById = false
  }
}

async function testGetByGroup() {
  loading.value.getByGroup = true
  try {
    const response = await registrationService.getByGroup(testId.value)
    results.value.getByGroup = {
      success: true,
      data: response.data
    }
    
    checkPopulate('GET /groups/:groupId', [response.data?.data])
    
    showNotify('✅ Endpoint funcionando correctamente')
  } catch (error) {
    results.value.getByGroup = {
      success: false,
      data: error.response?.data || error.message
    }
    showErrorNotify('❌ Error: ' + (error.response?.data?.msg || error.message))
  } finally {
    loading.value.getByGroup = false
  }
}

async function testGetByStudent() {
  loading.value.getByStudent = true
  try {
    const response = await registrationService.getByStudent(testId.value)
    results.value.getByStudent = {
      success: true,
      data: response.data
    }
    
    checkPopulate('GET /student/:studentId', [response.data?.data])
    
    showNotify('✅ Endpoint funcionando correctamente')
  } catch (error) {
    results.value.getByStudent = {
      success: false,
      data: error.response?.data || error.message
    }
    showErrorNotify('❌ Error: ' + (error.response?.data?.msg || error.message))
  } finally {
    loading.value.getByStudent = false
  }
}

async function testGetAttendantById() {
  loading.value.getAttendantById = true
  try {
    const response = await registrationService.getAttendantById(testId.value)
    results.value.getAttendantById = {
      success: true,
      data: response.data
    }
    showNotify('✅ Endpoint funcionando correctamente')
  } catch (error) {
    results.value.getAttendantById = {
      success: false,
      data: error.response?.data || error.message
    }
    showErrorNotify('❌ Error: ' + (error.response?.data?.msg || error.message))
  } finally {
    loading.value.getAttendantById = false
  }
}

async function testHelper() {
  loading.value.helper = true
  try {
    const registration = await getFullRegistrationById(testId.value)
    results.value.helper = {
      success: true,
      data: registration
    }
    showNotify('✅ Helper funcionó correctamente - Datos poblados!')
  } catch (error) {
    results.value.helper = {
      success: false,
      data: error.response?.data || error.message
    }
    showErrorNotify('❌ Error: ' + (error.response?.data?.msg || error.message))
  } finally {
    loading.value.helper = false
  }
}

// Verificar si los populates funcionan
function checkPopulate(endpoint, data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    populateChecks.value.push({
      endpoint,
      populated: false,
      reason: 'Sin datos'
    })
    return
  }

  const firstItem = data[0]
  const hasStudentPopulated = firstItem?.student && typeof firstItem.student === 'object' && firstItem.student.names
  const hasGroupPopulated = firstItem?.group && typeof firstItem.group === 'object' && firstItem.group.level
  const hasAttendantPopulated = firstItem?.attendant && Array.isArray(firstItem.attendant) && firstItem.attendant.length > 0
  const hasSchoolPopulated = firstItem?.school && typeof firstItem.school === 'object' && firstItem.school.name

  populateChecks.value.push({
    endpoint,
    populated: hasStudentPopulated || hasGroupPopulated || hasAttendantPopulated || hasSchoolPopulated,
    details: {
      student: hasStudentPopulated,
      group: hasGroupPopulated,
      attendant: hasAttendantPopulated,
      school: hasSchoolPopulated
    }
  })
}
</script>

<style scoped>
.result-box {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 12px;
  border: 1px solid #e0e0e0;
}
</style>
