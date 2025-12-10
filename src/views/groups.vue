<template>
  <div class="q-pa-md">
    <Spinner v-if="loading" size="4em" class="q-mb-md" />

    <Tables
      :columns="columns"
      :rows="groups"
      actions
      @edit="openEditModal"
      @toggleState="toggleState"
    />

    <q-btn label="Crear Grupo" color="primary" @click="openCreateModal" class="q-mt-md" />

    <GroupModal
      v-model="isModalOpen"
      :mode="modalMode"
      :formData="formData"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from "@/services/api.js"
import Tables from '@/components/Tables.vue'
import Spinner from '@/components/Spinner.vue'
import GroupModal from '@/components/GroupModal.vue'
import { useNotify } from '@/composables/useNotify'

const { showNotify, showErrorNotify } = useNotify()

const groups = ref([])
const loading = ref(false)
const isModalOpen = ref(false)
const modalMode = ref('create')

const formData = reactive({
  _id: '',
  headquarters: '',
  year: '',
  cycle: '',
  level: '',
  grade: '',
  groupIdentifier: '',
  session: '',
  groupDirector: ''
})

const columns = [
  { name: 'headquarters', label: 'Sede', field: row => row.headquarters?.name || row.headquarters, align: 'left' },
  { name: 'year', label: 'Año', field: 'year' },
  { name: 'cycle', label: 'Ciclo', field: 'cycle' },
  { name: 'level', label: 'Nivel', field: 'level' },
  { name: 'grade', label: 'Grado', field: 'grade' },
  { name: 'groupIdentifier', label: 'Identificador', field: 'groupIdentifier' },
  { name: 'session', label: 'Jornada', field: 'session' },
  { name: 'groupDirector', label: 'Director', field: row => row.groupDirector?.names || row.groupDirector },
  { name: 'active', label: 'Estado', field: 'isActive' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]

async function fetchGroups() {
  loading.value = true
  try {
    const { data } = await api.get('/api/grupos/year/2025')
    groups.value = Array.isArray(data.data) ? data.data : [data.data]
  } catch (e) {
    showErrorNotify('Error cargando grupos')
  }
  loading.value = false
}

function openCreateModal() {
  modalMode.value = 'create'
  Object.assign(formData, {
    _id: '', headquarters: '', year: '', cycle: '', level: '', grade: '', groupIdentifier: '', session: '', groupDirector: ''
  })
  isModalOpen.value = true
}

function openEditModal(row) {
  modalMode.value = 'edit'
  Object.assign(formData, row)
  isModalOpen.value = true
}

async function handleSubmit() {
  loading.value = true
  try {
    if (modalMode.value === 'create') {
      await api.post('/api/grupos', formData)
      showNotify('Grupo creado exitosamente')
    } else {
      await api.put(`/api/grupos/${formData._id}`, formData)
      showNotify('Grupo actualizado')
    }
    fetchGroups()
  } catch (e) {
    showErrorNotify('Error guardando grupo')
  }
  loading.value = false
  isModalOpen.value = false
}

async function toggleState(row) {
  loading.value = true
  try {
    const route = row.isActive ? 'desactivar' : 'activar'
    await api.put(`/api/grupos/${row._id}/${route}`)
    showNotify('Estado actualizado')
    fetchGroups()
  } catch (e) {
    showErrorNotify('Error actualizando estado')
  }
  loading.value = false
}

onMounted(fetchGroups)
</script>
