<template>
  <div class="q-pa-md">

    <h1 style="font-size: 3rem;">Gestion de Grupos</h1>

    <div class="row justify-end q-mt-md">
      <q-btn label="Crear Grupo" color="primary" @click="openCreateModal" />
    </div>

    <Spinner v-if="loading" size="4em" class="q-mb-md" />

    <Tables :columns="columns" :rows="groups" actions @edit="openEditModal" @toggleState="toggleState">

      <template #body-cell-isActive="{ row }">
        <q-td class="q-pa-none text-center">

          <q-btn :color="row.isActive ? 'positive' : 'negative'" :label="row.isActive ? 'ACTIVO' : 'INACTIVO'" size="sm"
            flat @click="toggleState(row)" />
        </q-td>
      </template>

      <template #body-cell-actions="{ row }">
        <q-td class="row-actions q-pa-none q-gutter-sm">

          <q-btn icon="edit" color="primary" flat dense round class="q-mr-sm" @click="openEditModal(row)" />

          <q-btn icon="delete" color="negative" flat dense round @click="confirmDelete(row)" />
        </q-td>
      </template>
    </Tables>

    <Modal v-model="isModalOpen" :mode="modalMode" :formData="formData" :headquarters="headquarters"
      :directors="directors" @submit="handleSubmit" />

  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue'
import Tables from '@/components/tables.vue'
import Spinner from '@/components/spinner.vue'
import Modal from '@/components/modal.vue'
import { useNotify } from '@/composables/useNotify'
import {
  createGroup,
  getAllGroupByYear,
  updateGroup,
  activateGroup,
  disableGroup,
  deleteGroup
} from '../services/groupsService.js'
import { getAllSedes } from '../services/headquarterService.js'
import { getUsersByRol } from '../services/schoolUserService.js'
const { showNotify, showErrorNotify } = useNotify()
const groups = ref([])
const headquarters = ref([])
const directors = ref([])
const loading = ref(false)
const isModalOpen = ref(false)
const modalMode = ref('create')
const currentYear = new Date().getFullYear()

const formData = reactive({
  _id: '',
  headquarters: '',
  cycle: '',
  level: '',
  grade: '',
  groupIdentifier: '',
  session: '',
  groupDirector: ''
})

const columns = [
  { name: 'headquarters', label: 'Sede', field: row => row.headquarters?.name, align: 'left' },
  { name: 'cycle', label: 'Ciclo', field: 'cycle' },
  { name: 'level', label: 'Nivel', field: 'level' },
  { name: 'grade', label: 'Grado', field: 'grade' },
  { name: 'session', label: 'Jornada', field: 'session' },
  { name: 'director', label: 'Director', field: row => row.groupDirector?.names },
  { name: 'isActive', label: 'Estado', field: 'isActive', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]

async function fetchGroups() {
  loading.value = true
  try {
    const { data } = await getAllGroupByYear(currentYear)
    console.log("API response:", data)
    groups.value = Array.isArray(data) ? data : []
  } catch (e) {
    groups.value = []
    showErrorNotify('Error cargando grupos')
  }
  loading.value = false
}

// NUEVA FUNCIÓN: Cargar todas las sedes
async function fetchHeadquarters() {
  try {
    const response = await getAllSedes() // Ajusta según tu service
    console.log("Sedes response:", response) // DEBUG: Ver qué retorna

    // La API retorna { headquarters: [...] }
    headquarters.value = Array.isArray(response.headquarters) ? response.headquarters :
      Array.isArray(response.data?.headquarters) ? response.data.headquarters :
        Array.isArray(response.data) ? response.data :
          Array.isArray(response) ? response : []

    console.log("Sedes cargadas:", headquarters.value) // DEBUG
  } catch (e) {
    console.error("Error cargando sedes:", e) // DEBUG
    headquarters.value = []
    showErrorNotify('Error cargando sedes')
  }
}

// NUEVA FUNCIÓN: Cargar directores (usuarios con rol profesor)
async function fetchDirectors() {
  try {
    const response = await getUsersByRol('profesor') // Ajusta según tu service
    console.log("Users response:", response) // DEBUG: Ver qué retorna

    // Ajusta según la estructura de tu respuesta (puede ser response.users o response.data)
    const allUsers = Array.isArray(response.users) ? response.users :
      Array.isArray(response.data?.users) ? response.data.users :
        Array.isArray(response.data) ? response.data :
          Array.isArray(response) ? response : []

    // Filtrar solo usuarios que tengan el rol 'profesor'
    directors.value = allUsers.filter(user =>
      user.roles && user.roles.some(roleObj => roleObj.role === 'profesor')
    )

    console.log("Directores cargados:", directors.value) // DEBUG
  } catch (e) {
    console.error("Error cargando directores:", e) // DEBUG
    directors.value = []
    showErrorNotify('Error cargando directores')
  }
}

function openCreateModal() {
  modalMode.value = 'create'
  Object.assign(formData, {
    _id: '', headquarters: '', cycle: '', level: '', grade: '', groupIdentifier: '', session: '', groupDirector: ''
  })
  isModalOpen.value = true
}

function openEditModal(row) {
  modalMode.value = 'edit'
  // Al abrir el modal, normalizamos: si vienen objetos populated (headquarters/groupDirector),
  // guardamos los _id en el form para enviar al backend en la actualización
  Object.assign(formData, {
    _id: row._id,
    headquarters: row.headquarters?._id ?? row.headquarters,
    cycle: row.cycle,
    level: row.level,
    grade: row.grade,
    groupIdentifier: row.groupIdentifier,
    session: row.session,
    groupDirector: row.groupDirector?._id ?? row.groupDirector
  })
  isModalOpen.value = true
}

async function handleSubmit() {
  loading.value = true
  try {
    formData.year = currentYear
    if (modalMode.value === 'create') {
      await createGroup(formData._id, formData)
      showNotify('Grupo creado exitosamente')
    } else {
      await updateGroup(formData._id, formData)
      showNotify('Grupo actualizado')
    }
    await fetchGroups()
  } catch (e) {
    showErrorNotify('Error guardando grupo')
  }
  loading.value = false
  isModalOpen.value = false
}

async function toggleState(row) {
  loading.value = true
  try {
    if (row.isActive) {
      await disableGroup(row._id)
    } else {
      await activateGroup(row._id)
    }
    showNotify('Estado actualizado')
    await fetchGroups()
  } catch (e) {
    showErrorNotify('Error actualizando estado')
  }
  loading.value = false
}

async function confirmDelete(row) {
  const proceed = confirm('¿Eliminar este grupo? Esta acción no se puede deshacer.')
  if (!proceed) return

  loading.value = true
  try {
    await deleteGroup(row._id)
    showNotify('Grupo eliminado')
    await fetchGroups()
  } catch (e) {
    showErrorNotify('Error eliminando grupo')
  }
  loading.value = false
}

onMounted(() => {
  fetchGroups()
  fetchHeadquarters() // Cargar sedes al montar
  fetchDirectors() // Cargar directores al montar
})
</script>

<!-- <style scoped>
.row-actions {
  display: flex;
  align-items: center;
} -->
<!-- </style> -->