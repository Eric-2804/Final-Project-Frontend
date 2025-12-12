<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card class="shadow1">
          <q-card-section class="bg-primary text-white">
            <div class="text-h5">Nueva Matrícula</div>
            <div class="text-caption">Complete el formulario para registrar una nueva matrícula</div>
          </q-card-section>

          <q-separator />

          <!-- Loading spinner -->
          <div v-if="isLoading" class="text-center q-pa-xl">
            <Spinner size="50px" />
            <div class="text-caption q-mt-md">Cargando formulario...</div>
          </div>

          <q-card-section v-else>
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
                      label="Número de Matrícula (opcional)"
                      filled
                      hint="Se generará automáticamente si se deja vacío"
                    >
                      <template v-slot:prepend>
                        <q-icon name="confirmation_number" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Colegio -->
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="form.school"
                      :options="schoolOptions"
                      label="Colegio *"
                      filled
                      emit-value
                      map-options
                      :rules="[val => !!val || 'El colegio es requerido']"
                      @update:model-value="onSchoolChange"
                    >
                      <template v-slot:prepend>
                        <q-icon name="school" />
                      </template>
                    </q-select>
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
                      hint="Describa brevemente esta matrícula"
                    />
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- SECCIÓN 2: Estudiante -->
              <div class="form-section">
                <div class="text-h6 text-primary q-mb-md">
                  <q-icon name="person" class="q-mr-sm" />
                  Estudiante
                </div>

                <div class="row q-col-gutter-md">
                  <!-- Selector de estudiante -->
                  <div class="col-12">
                    <q-select
                      v-model="form.student"
                      :options="filteredStudents"
                      label="Buscar Estudiante *"
                      filled
                      use-input
                      input-debounce="300"
                      emit-value
                      map-options
                      option-value="value"
                      option-label="label"
                      @filter="filterStudents"
                      :rules="[val => !!val || 'Debe seleccionar un estudiante']"
                      hint="Escriba el nombre o documento del estudiante"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No se encontraron estudiantes
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                            <q-item-label caption>{{ scope.opt.document }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <!-- Info del estudiante seleccionado -->
                  <div v-if="selectedStudent" class="col-12">
                    <q-banner class="bg-blue-1 text-blue-9">
                      <template v-slot:avatar>
                        <q-icon name="check_circle" color="blue" />
                      </template>
                      <div class="text-weight-medium">{{ selectedStudent.label }}</div>
                      <div class="text-caption">
                        Doc: {{ selectedStudent.document }} | 
                        Email: {{ selectedStudent.email || 'N/A' }}
                      </div>
                    </q-banner>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- SECCIÓN 3: Grupo -->
              <div class="form-section">
                <div class="text-h6 text-primary q-mb-md">
                  <q-icon name="groups" class="q-mr-sm" />
                  Grupo
                </div>

                <div class="row q-col-gutter-md">
                  <!-- Sede (opcional si no hay sedes disponibles) -->
                  <div class="col-12 col-md-6" v-if="headquarterOptions.length > 0">
                    <q-select
                      v-model="selectedHeadquarter"
                      :options="headquarterOptions"
                      label="Sede"
                      filled
                      emit-value
                      map-options
                      @update:model-value="loadGroupsByHeadquarter"
                    >
                      <template v-slot:prepend>
                        <q-icon name="location_on" />
                      </template>
                    </q-select>
                  </div>

                  <!-- Grupo -->
                  <div :class="headquarterOptions.length > 0 ? 'col-12 col-md-6' : 'col-12'">
                    <q-select
                      v-model="form.group"
                      :options="groupOptions"
                      label="Grupo *"
                      filled
                      emit-value
                      map-options
                      :rules="[val => !!val || 'El grupo es requerido']"
                      :hint="headquarterOptions.length > 0 ? 'Seleccione primero la sede' : 'Grupos disponibles'"
                    >
                      <template v-slot:prepend>
                        <q-icon name="class" />
                      </template>
                    </q-select>
                  </div>

                  <!-- Info del grupo seleccionado -->
                  <div v-if="selectedGroup" class="col-12">
                    <q-banner class="bg-green-1 text-green-9">
                      <template v-slot:avatar>
                        <q-icon name="check_circle" color="green" />
                      </template>
                      <div class="text-weight-medium">{{ selectedGroup.label }}</div>
                      <div class="text-caption">
                        {{ selectedGroup.level }} | 
                        Jornada: {{ selectedGroup.session }}
                      </div>
                    </q-banner>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- SECCIÓN 4: Acudientes -->
              <div class="form-section">
                <div class="text-h6 text-primary q-mb-md">
                  <q-icon name="supervisor_account" class="q-mr-sm" />
                  Acudientes
                  <q-chip color="orange" text-color="white" size="sm" class="q-ml-sm">
                    Mínimo 1 requerido
                  </q-chip>
                </div>

                <!-- Lista de acudientes agregados -->
                <div v-if="form.attendant.length > 0" class="q-mb-md">
                  <q-list bordered separator>
                    <q-item v-for="(att, index) in form.attendant" :key="index">
                      <q-item-section avatar>
                        <q-avatar color="primary" text-color="white" icon="person" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ getAttendantName(att._id) }}</q-item-label>
                        <q-item-label caption>
                          Parentesco: {{ att.relationship }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          round
                          color="negative"
                          icon="delete"
                          @click="removeAttendant(index)"
                        >
                          <q-tooltip>Eliminar acudiente</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <!-- Formulario para agregar acudiente -->
                <q-card flat bordered class="bg-grey-1">
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-md">Agregar Acudiente</div>
                    
                    <div class="row q-col-gutter-md">
                      <!-- Buscar acudiente -->
                      <div class="col-12 col-md-8">
                        <q-select
                          v-model="newAttendant.id"
                          :options="filteredAttendants"
                          label="Buscar Acudiente"
                          filled
                          use-input
                          input-debounce="300"
                          emit-value
                          map-options
                          @filter="filterAttendants"
                        >
                          <template v-slot:prepend>
                            <q-icon name="search" />
                          </template>
                          <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                              <q-item-section>
                                <q-item-label>{{ scope.opt.label }}</q-item-label>
                                <q-item-label caption>{{ scope.opt.document }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>

                      <!-- Parentesco -->
                      <div class="col-12 col-md-4">
                        <q-select
                          v-model="newAttendant.relationship"
                          :options="relationshipOptions"
                          label="Parentesco"
                          filled
                          emit-value
                          map-options
                        />
                      </div>

                      <!-- Botón agregar -->
                      <div class="col-12">
                        <q-btn
                          color="primary"
                          icon="add"
                          label="Agregar Acudiente"
                          @click="addAttendant"
                          :disable="!newAttendant.id || !newAttendant.relationship"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Advertencia si no hay acudientes -->
                <div v-if="form.attendant.length === 0" class="q-mt-md">
                  <q-banner class="bg-orange-1 text-orange-9">
                    <template v-slot:avatar>
                      <q-icon name="warning" color="orange" />
                    </template>
                    Debe agregar al menos un acudiente antes de guardar la matrícula
                  </q-banner>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="row q-mt-lg q-gutter-sm justify-end">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-7"
                  @click="goBack"
                />
                <q-btn
                  label="Guardar Matrícula"
                  color="primary"
                  icon="save"
                  type="submit"
                  :loading="isSaving"
                  :disable="form.attendant.length === 0"
                />
              </div>

            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '@/components/Spinner.vue'
import { useNotify } from '@/composables/useNotify'
import { useAuthStore } from '@/stores/auth'
import registrationService from '@/services/registrationService'
import { getUsersByRol, getUserById } from '@/services/schoolUserService'
import { getAllGroupByYear } from '@/services/groupsService'
import { getHeadquartersBySchool } from '@/services/headquarterService'

const router = useRouter()
const authStore = useAuthStore()
const { showNotify, showErrorNotify } = useNotify()

// Estado
const isLoading = ref(false)
const isSaving = ref(false)

// Datos del formulario
const form = ref({
  student: null,
  attendant: [],
  group: null,
  year: new Date().getFullYear(),
  registrationDate: new Date().toISOString().split('T')[0],
  registrationNumber: '',
  description: '',
  school: null
})

// Nuevo acudiente temporal
const newAttendant = ref({
  id: null,
  relationship: null
})

// Opciones
const yearOptions = ref([
  { label: '2024', value: 2024 },
  { label: '2025', value: 2025 },
  { label: '2026', value: 2026 }
])

const relationshipOptions = [
  { label: 'Madre', value: 'madre' },
  { label: 'Padre', value: 'padre' },
  { label: 'Tío', value: 'tío' },
  { label: 'Tía', value: 'tía' },
  { label: 'Abuelo', value: 'abuelo' },
  { label: 'Abuela', value: 'abuela' },
  { label: 'Otro', value: 'otro' }
]

// Listas de datos
const schoolOptions = ref([])
const studentOptions = ref([])
const attendantOptions = ref([])
const headquarterOptions = ref([])
const groupOptions = ref([])

const filteredStudents = ref([])
const filteredAttendants = ref([])
const selectedHeadquarter = ref(null)

// Computed
const selectedStudent = computed(() => {
  return studentOptions.value.find(s => s.value === form.value.student)
})

const selectedGroup = computed(() => {
  return groupOptions.value.find(g => g.value === form.value.group)
})

// Funciones de carga
async function loadInitialData() {
  isLoading.value = true
  console.log('🔄 Iniciando carga de datos del formulario...')
  
  // Verificar token
  const token = localStorage.getItem('token')
  console.log('🔑 Token en localStorage:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN')
  
  if (!token) {
    showErrorNotify({ message: 'No hay sesión activa. Redirigiendo al login...' })
    setTimeout(() => router.push('/'), 1500)
    isLoading.value = false
    return
  }
  
  try {
    console.log('👤 Usuario inicial:', authStore.user)
    
    // Si el usuario no tiene college, cargar datos completos
    if (!authStore.user?.college) {
      console.log('⚠️ Usuario sin college, cargando datos completos...')
      
      if (authStore.user?.id) {
        try {
          const fullUser = await getUserById(authStore.user.id)
          console.log('✅ Datos completos del usuario obtenidos:', fullUser)
          
          // Actualizar el store con los datos completos
          authStore.setUser(fullUser)
          console.log('✅ Usuario actualizado en el store')
        } catch (error) {
          console.error('❌ Error al cargar datos completos del usuario:', error)
        }
      }
    }
    
    // Intentar obtener el colegio/sede del usuario (puede tener diferentes nombres)
    const userCollege = authStore.user?.college || authStore.user?.sede || authStore.user?.school
    console.log('🏫 College encontrado:', userCollege)
    
    if (userCollege) {
      let schoolId = null
      
      // Si college es un objeto poblado
      if (typeof userCollege === 'object' && userCollege._id) {
        schoolId = userCollege._id
        form.value.school = schoolId
        schoolOptions.value = [{
          label: userCollege.name || userCollege.nameSchool || 'Mi Colegio',
          value: schoolId
        }]
        console.log('✅ Colegio del usuario (objeto):', userCollege)
      } 
      // Si college es solo un ID string
      else if (typeof userCollege === 'string') {
        schoolId = userCollege
        form.value.school = schoolId
        schoolOptions.value = [{
          label: 'Mi Colegio',
          value: schoolId
        }]
        console.log('✅ ID del colegio del usuario:', schoolId)
      }
      
      // Cargar sedes automáticamente
      if (schoolId) {
        console.log('📍 Cargando sedes del colegio', schoolId)
        await onSchoolChange(schoolId)
      }
    } else {
      console.error('❌ Usuario no tiene sede/colegio asignado después de cargar datos completos')
      console.error('❌ Usuario final:', authStore.user)
      showErrorNotify({ message: 'Tu usuario no tiene una sede asignada. Contacta al administrador.' })
      isLoading.value = false
      return
    }

    // Cargar estudiantes por rol
    console.log('👨‍🎓 Cargando estudiantes...')
    const estudiantesRes = await getUsersByRol('estudiante')
    console.log('👨‍🎓 Respuesta completa de estudiantes:', estudiantesRes)
    
    // La respuesta puede venir como array directamente o en .data
    const estudiantes = Array.isArray(estudiantesRes) ? estudiantesRes : (estudiantesRes.data || [])
    console.log('✅ Estudiantes procesados:', estudiantes.length, estudiantes)

    if (Array.isArray(estudiantes) && estudiantes.length > 0) {
      studentOptions.value = estudiantes.map(u => ({
        label: `${u.names || ''} ${u.lastNames || ''}`.trim(),
        value: u._id,
        document: u.numberDocument || 'Sin documento',
        email: u.email || 'Sin email'
      }))

      filteredStudents.value = studentOptions.value
      console.log('✅ studentOptions configurados:', studentOptions.value.length)
    } else {
      console.warn('⚠️ No hay estudiantes disponibles')
      studentOptions.value = []
      filteredStudents.value = []
    }

    // Cargar acudientes por rol
    console.log('👨‍👩‍👧 Cargando acudientes...')
    const acudientesRes = await getUsersByRol('acudiente')
    console.log('👨‍👩‍👧 Respuesta completa de acudientes:', acudientesRes)
    
    // La respuesta puede venir como array directamente o en .data
    const acudientes = Array.isArray(acudientesRes) ? acudientesRes : (acudientesRes.data || [])
    console.log('✅ Acudientes procesados:', acudientes.length, acudientes)
    
    if (Array.isArray(acudientes) && acudientes.length > 0) {
      attendantOptions.value = acudientes.map(u => ({
        label: `${u.names || ''} ${u.lastNames || ''}`.trim(),
        value: u._id,
        document: u.numberDocument || 'Sin documento',
        email: u.email || 'Sin email'
      }))
      filteredAttendants.value = attendantOptions.value
      console.log('✅ attendantOptions configurados:', attendantOptions.value.length)
    } else {
      console.warn('⚠️ No hay acudientes disponibles')
      attendantOptions.value = []
      filteredAttendants.value = []
    }
    
    console.log('🎉 Carga de datos completada exitosamente')

  } catch (error) {
    console.error('❌ Error cargando datos del formulario:', error)
    console.error('Detalles del error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    // Inicializar arrays vacíos para que el formulario no crashee
    schoolOptions.value = []
    studentOptions.value = []
    attendantOptions.value = []
    filteredStudents.value = []
    filteredAttendants.value = []
    
    // Mostrar error apropiado
    if (error.response?.status === 401) {
      showErrorNotify({ message: 'Sesión expirada. Por favor inicia sesión nuevamente' })
    } else {
      const errorMsg = error.response?.data?.msg || 'Error al cargar los datos del formulario'
      showErrorNotify({ message: errorMsg })
    }
  } finally {
    isLoading.value = false
  }
}

async function onSchoolChange(schoolId) {
  if (!schoolId) {
    console.warn('⚠️ onSchoolChange llamado sin schoolId')
    return
  }

  console.log('📍 onSchoolChange - Cargando sedes para colegio:', schoolId)
  
  try {
    // Cargar sedes del colegio
    const headquartersRes = await getHeadquartersBySchool(schoolId)
    console.log('📍 Respuesta de sedes:', headquartersRes)
    
    const headquarters = headquartersRes.data?.data || headquartersRes.data || []
    console.log('📍 Sedes procesadas:', headquarters)
    
    if (Array.isArray(headquarters) && headquarters.length > 0) {
      headquarterOptions.value = headquarters.map(h => ({
        label: h.name,
        value: h._id
      }))
      console.log('✅ Sedes configuradas:', headquarterOptions.value.length, headquarterOptions.value)
    } else {
      console.warn('⚠️ No hay sedes disponibles o la respuesta no es un array:', headquarters)
      headquarterOptions.value = []
    }

    // Resetear selección
    selectedHeadquarter.value = null
    form.value.group = null
    groupOptions.value = []

  } catch (error) {
    console.error('Error cargando sedes:', error)
    
    // Si es 404, el colegio no tiene sedes - cargar todos los grupos directamente
    if (error.response?.status === 404) {
      console.log('ℹ️ El colegio no tiene sedes registradas - cargando todos los grupos del año')
      headquarterOptions.value = []
      
      // Cargar todos los grupos del año actual sin filtrar por sede
      try {
        const year = new Date().getFullYear()
        const groupsRes = await getAllGroupByYear(year)
        const allGroups = groupsRes.data?.data || groupsRes.data || []
        
        if (Array.isArray(allGroups) && allGroups.length > 0) {
          groupOptions.value = allGroups.map(g => ({
            label: `${g.name} - ${g.level || ''}`,
            value: g._id
          }))
          console.log('✅ Grupos cargados sin filtro de sede:', groupOptions.value.length)
        }
      } catch (groupError) {
        console.error('Error cargando grupos:', groupError)
      }
    } else {
      const errorMsg = error.response?.data?.msg || 'Error al cargar las sedes'
      showErrorNotify({ message: errorMsg })
    }
  }
}

async function loadGroupsByHeadquarter(headquarterId) {
  if (!headquarterId) return

  try {
    // Cargar todos los grupos
    const groupsRes = await getAllGroups()
    const allGroups = groupsRes.data?.data || groupsRes.data || []

    if (!Array.isArray(allGroups)) {
      console.warn('La respuesta de grupos no es un array:', allGroups)
      groupOptions.value = []
      return
    }

    // Filtrar por sede
    const filteredGroups = allGroups.filter(g => {
      const groupHeadquarter = g.headquarters?._id || g.headquarters
      return groupHeadquarter === headquarterId
    })

    groupOptions.value = filteredGroups.map(g => ({
      label: `${g.level || ''} ${g.grade || ''}${g.groupIdentifier || ''} - ${g.session || ''}`.trim(),
      value: g._id,
      level: g.level || '',
      session: g.session || ''
    }))

    if (groupOptions.value.length === 0) {
      showErrorNotify({ message: 'No hay grupos disponibles para esta sede' })
    }

  } catch (error) {
    console.error('Error cargando grupos:', error)
    const errorMsg = error.response?.data?.msg || 'Error al cargar los grupos'
    showErrorNotify({ message: errorMsg })
  }
}

function filterStudents(val, update) {
  update(() => {
    if (val === '') {
      filteredStudents.value = studentOptions.value
    } else {
      const needle = val.toLowerCase()
      filteredStudents.value = studentOptions.value.filter(
        s => s.label.toLowerCase().includes(needle) || 
             s.document?.toLowerCase().includes(needle)
      )
    }
  })
}

function filterAttendants(val, update) {
  update(() => {
    if (val === '') {
      filteredAttendants.value = attendantOptions.value
    } else {
      const needle = val.toLowerCase()
      filteredAttendants.value = attendantOptions.value.filter(
        a => a.label.toLowerCase().includes(needle) || 
             a.document?.toLowerCase().includes(needle)
      )
    }
  })
}

function addAttendant() {
  if (!newAttendant.value.id || !newAttendant.value.relationship) {
    showErrorNotify({ message: 'Seleccione un acudiente y el parentesco' })
    return
  }

  // Verificar que no esté ya agregado
  const exists = form.value.attendant.some(a => a._id === newAttendant.value.id)
  if (exists) {
    showErrorNotify({ message: 'Este acudiente ya fue agregado' })
    return
  }

  form.value.attendant.push({
    _id: newAttendant.value.id,
    relationship: newAttendant.value.relationship
  })

  // Resetear formulario de nuevo acudiente
  newAttendant.value = {
    id: null,
    relationship: null
  }

  showNotify({ message: 'Acudiente agregado correctamente' })
}

function removeAttendant(index) {
  form.value.attendant.splice(index, 1)
  showNotify({ message: 'Acudiente eliminado' })
}

function getAttendantName(attendantId) {
  const attendant = attendantOptions.value.find(a => a.value === attendantId)
  return attendant ? attendant.label : 'Desconocido'
}

async function submitForm() {
  // Validar que haya al menos un acudiente
  if (form.value.attendant.length === 0) {
    showErrorNotify({ message: 'Debe agregar al menos un acudiente' })
    return
  }

  isSaving.value = true
  
  // 🔍 Logs de diagnóstico
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('🔍 Verificación pre-submit:');
  console.log('  - Token presente:', !!token);
  console.log('  - Token (primeros 30):', token?.substring(0, 30));
  console.log('  - Usuario:', user);
  console.log('  - Rol usuario:', user?.rol || user?.roles);
  
  try {
    const data = {
      student: form.value.student,
      attendant: form.value.attendant,
      group: form.value.group,
      year: form.value.year,
      registrationDate: form.value.registrationDate,
      registrationNumber: form.value.registrationNumber,
      description: form.value.description,
      school: form.value.school
    }
    
    console.log('📤 Enviando payload:', data);

    await registrationService.create(data)
    
    showNotify({ message: 'Matrícula creada exitosamente' })
    
    // Redirigir a la lista después de 1 segundo
    setTimeout(() => {
      router.push({ name: 'Gestion_Matriculas' })
    }, 1000)

  } catch (error) {
    console.error('❌ Error al crear matrícula:', error)
    console.error('  - Status:', error.response?.status);
    console.error('  - Data:', error.response?.data);
    console.error('  - Headers:', error.response?.headers);
    
    const errorMsg = error.response?.data?.msg || 'Error al crear la matrícula'
    showErrorNotify({ message: errorMsg })
    
    // Si es 401, verificar token
    if (error.response?.status === 401) {
      console.error('🚨 Error 401 - Verificando autenticación...');
      const currentToken = localStorage.getItem('token');
      console.error('  - Token actual en localStorage:', currentToken ? 'Existe' : 'NO EXISTE');
    }
  } finally {
    isSaving.value = false
  }
}

function goBack() {
  router.push({ name: 'Gestion_Matriculas' })
}

// Lifecycle
onMounted(() => {
  loadInitialData()
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
