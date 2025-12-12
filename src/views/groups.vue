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

    <Modal
      v-model="isModalOpen"
      :mode="modalMode"
      :formData="formData"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// import api from "@/services/api.js"
import Tables from '@/components/tables.vue'
import Spinner from '@/components/Spinner.vue'
import Modal from '@/components/modal.vue'
import { useNotify } from '@/composables/useNotify'
import { createGroup, getGroupById, getAllGroupByYear, getGuardiansByGroup, getGroupsByHeadquarters, getStudentsByGroup, updateGroup, activateGroup, disableGroup, deleteGroup } from '../services/groupsService'

const { showNotify, showErrorNotify } = useNotify()
const groups = ref([])
const loading = ref(false)
const isModalOpen = ref(false)
const modalMode = ref('create')

const formData = reactive({
  _id: '',
  headquarters: '',
  cycle: '',
  level: '',
  grade: '',
  groupIdentifier: '',
  session: '',
  // groupDirector: ''
})

const columns = [
  { name: 'headquarters', label: 'Sede', field: row => row.headquarters?.name || row.headquarters, align: 'left' },
  { name: 'cycle', label: 'Ciclo', field: 'cycle' },
  { name: 'level', label: 'Nivel', field: 'level' },
  { name: 'grade', label: 'Grado', field: 'grade' },
  { name: 'groupIdentifier', label: 'Identificador', field: 'groupIdentifier' },
  { name: 'session', label: 'Jornada', field: 'session' },
  // { name: 'groupDirector', label: 'Director', field: row => row.groupDirector?.names || row.groupDirector },
  { name: 'active', label: 'Estado', field: 'isActive' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]

async function fetchGroups() {
  loading.value = true
  try {
    const { data } = await getAllGroupByYear('2025')
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

async function toggleState(row) {
  loading.value = true;
  try {
    if (row.isActive) {
      await disableGroup(row._id);
    } else {
      await activateGroup(row._id);
    }
    showNotify('Estado actualizado');
    fetchGroups();
  } catch (e) {
    showErrorNotify('Error actualizando estado');
  }
  loading.value = false;
}

onMounted(fetchGroups)
</script>
