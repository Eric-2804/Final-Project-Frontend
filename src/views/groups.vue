<template>
  <div class="q-pa-md groups-container">

    <div class="groups-header">
      <h1 class="groups-title">Gestión de Grupos Académicos</h1>

      <q-btn
        label="Crear Grupo"
        color="primary"
        icon="add"
        class="create-btn"
        @click="openCreateModal"
      />
    </div>

    <Spinner v-if="loading" size="4em" class="q-mb-md" />

    <Tables
      :columns="columns"
      :rows="groups"
      actions
      @edit="openEditModal"
      @toggleState="toggleState"
    >

      <template #body-cell-isActive="{ row }">
        <q-td class="q-pa-none text-center">
          <q-btn
            :color="row.isActive ? 'positive' : 'negative'"
            :label="row.isActive ? 'ACTIVO' : 'INACTIVO'"
            size="sm"
            flat
            @click="toggleState(row)"
          />
        </q-td>
      </template>

      <template #body-cell-actions="{ row }">
        <q-td class="row-actions q-pa-none q-gutter-sm">
          <q-btn
            icon="edit"
            color="primary"
            flat
            dense
            round
            @click="openEditModal(row)"
          />

          <q-btn
            icon="delete"
            color="negative"
            flat
            dense
            round
            @click="confirmDelete(row)"
          />
        </q-td>
      </template>

    </Tables>

    <Modal
      v-model="isModalOpen"
      :mode="modalMode"
      :formData="formData"
      :headquarters="headquarters"
      :directors="directors"
      @submit="handleSubmit"
    />

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import Tables from '@/components/tables.vue'
import Spinner from '@/components/Spinner.vue'
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
import { getUsersByRole } from '../services/schoolUserService.js'

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
  { name: 'headquarters', label: 'Sede', field: row => row.headquarters?.name, align: 'center' },
  { name: 'cycle', label: 'Ciclo', field: 'cycle', align: 'center' },
  { name: 'level', label: 'Nivel', field: 'level', align: 'center' },
  { name: 'grade', label: 'Grado', field: 'grade', align: 'center' },
  { name: 'session', label: 'Jornada', field: 'session', align: 'center' },
  { name: 'director', label: 'Director', field: row => row.groupDirector?.names, align: 'center' },
  { name: 'isActive', label: 'Estado', field: 'isActive', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
]

async function fetchGroups() {
  loading.value = true
  try {
    const { data } = await getAllGroupByYear(currentYear)
    groups.value = Array.isArray(data) ? data : []
  } catch (e) {
    groups.value = []
    showErrorNotify('Error cargando grupos')
  } finally {
    loading.value = false
  }
}

watch(groups, (newGroups) => {
  const map = new Map()

  newGroups.forEach(group => {
    if (group.headquarters && group.headquarters._id) {
      map.set(group.headquarters._id, {
        _id: group.headquarters._id,
        name: group.headquarters.name
      })
    }
  })
  headquarters.value = Array.from(map.values())
}, { immediate: true })

async function fetchDirectors() {
  try {
    const response = await getUsersByRole("profesor")

    const users =
      Array.isArray(response?.users) ? response.users :
        Array.isArray(response?.data?.users) ? response.data.users :
          Array.isArray(response?.data) ? response.data :
            Array.isArray(response) ? response : []

    directors.value = users

    console.log('🎯 Directores reales cargados:', users)
    console.log('🎯 Directors reactive:', directors.value)

  } catch (e) {
    directors.value = []
    showErrorNotify('Error cargando directores')
  }
}

function openCreateModal() {
  modalMode.value = 'create'
  Object.assign(formData, {
    _id: '',
    headquarters: '',
    cycle: '',
    level: '',
    grade: '',
    groupIdentifier: '',
    session: '',
    groupDirector: ''
  })
  isModalOpen.value = true
}

function openEditModal(row) {
  modalMode.value = 'edit'
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
    const payload = {
      headquarters: formData.headquarters,
      year: currentYear,
      cycle: formData.cycle,
      level: formData.level,
      grade: formData.grade,
      groupIdentifier: formData.groupIdentifier,
      session: formData.session,
      groupDirector: formData.groupDirector
    }

    console.log('📤 Payload enviado:', payload)

    if (modalMode.value === 'create') {
      await createGroup(formData.headquarters, payload)
      showNotify('Grupo creado exitosamente')
    } else {
      await updateGroup(formData._id, payload)
      showNotify('Grupo actualizado')
    }

    await fetchGroups()
  } catch (e) {
    console.error(e)
    showErrorNotify('Error guardando grupo')
  } finally {
    loading.value = false
    isModalOpen.value = false
  }
}


async function toggleState(row) {
  loading.value = true
  try {
    row.isActive
      ? await disableGroup(row._id)
      : await activateGroup(row._id)

    showNotify('Estado actualizado')
    await fetchGroups()
  } catch (e) {
    showErrorNotify('Error actualizando estado')
  } finally {
    loading.value = false
  }
}

async function confirmDelete(row) {
  if (!confirm('¿Eliminar este grupo?')) return

  loading.value = true
  try {
    await deleteGroup(row._id)
    showNotify('Grupo eliminado')
    await fetchGroups()
  } catch (e) {
    showErrorNotify('Error eliminando grupo')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGroups()
  fetchDirectors()
})

</script>

<style scoped>
.groups-container {
  max-width: 100%;
}

.groups-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; 
}

.groups-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #6b7280; 
  margin: 0; 
}

.create-btn {
  height: 42px;
}
</style>
