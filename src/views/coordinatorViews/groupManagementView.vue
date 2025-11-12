<template>
  <div class="group-management-page">
    <!-- Header -->
    <div class="header-section">
      <div class="title-row">
        <q-icon name="groups" color="primary" size="32px" class="q-mr-md" />
        <div>
          <h2 class="main-title">Consulta de Grupos</h2>
          <p class="subtitle">
            Visualiza la información de los estudiantes y acudientes de tus grupos asignados.
          </p>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-row q-mb-md row items-center">
      <div class="q-gutter-md row items-center">
        <span>Seleccionar Grupo:</span>
        <q-select
          v-model="selectedGroup"
          :options="groupOptions"
          outlined
          dense
          style="min-width: 150px;"
        />
      </div>

      <div class="q-gutter-md row items-center q-ml-md">
        <span>Buscar:</span>
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          placeholder="Buscar por estudiante..."
          style="min-width: 220px;"
        />
      </div>
    </div>

    <!-- Tabla -->
    <Tables
      :columns="columns"
      :rows="paginatedRows"
      :actions="true"
      @edit="handleEdit"
      @toggleState="handleToggleState"
    />

    <!-- Paginación -->
    <div class="pagination-row q-mt-md row items-center justify-end">
      <div class="results-info q-mr-md">
        Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredRows.length }}
      </div>
      <q-pagination v-model="page" :max="maxPage" color="primary" />
    </div>

    <!-- Diálogo para editar -->
    <q-dialog v-model="showEditDialog" persistent>
      <BaseForm
        title="Editar Estudiante"
        subtitle="Modifica la información y guarda los cambios"
        submitLabel="Guardar Cambios"
        cancelLabel="Cancelar"
        :modelValue="editFormData"
        @submit="saveEdit"
        @cancel="showEditDialog = false"
      >
        <!-- Campos del formulario -->
        <template #fields="{ form }">
          <q-input v-model="form.estudiante" label="Nombre del Estudiante" outlined dense />
          <q-input v-model="form.documento" label="Documento" outlined dense />
          <q-input v-model="form.telefono" label="Teléfono" outlined dense />
          <q-input v-model="form.correo" label="Correo" outlined dense />
        </template>
      </BaseForm>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tables from '@/components/tables.vue'
import BaseForm from '@/components/BaseForm.vue'

// Datos
const groupOptions = ['Grupo 6A', 'Grupo 6B', 'Grupo 7A', 'Grupo 7B']
const selectedGroup = ref(groupOptions[0])
const search = ref('')
const page = ref(1)
const rowsPerPage = 5
const showEditDialog = ref(false)
const editFormData = ref({})

// Datos de ejemplo
const rows = ref([
  { index: 1, estudiante: 'Ana Sofia Becerra', documento: '10051', telefono: '3101234567', correo: 'ana@example.com', active: true },
  { index: 2, estudiante: 'Benjamin Corzo Diaz', documento: '10052', telefono: '3112345678', correo: 'benjamin@example.com', active: true },
  { index: 3, estudiante: 'Camila Fuentes Gil', documento: '10053', telefono: '3123456789', correo: 'camila@example.com', active: false }
])

const columns = [
  { name: 'index', label: '#', field: 'index', align: 'left' },
  { name: 'estudiante', label: 'Estudiante', field: 'estudiante', align: 'left', sortable: true },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left', sortable: true },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
]

// Filtros y paginación
const filteredRows = computed(() => {
  let filtered = rows.value
  if (search.value) {
    const q = search.value.toLowerCase()
    filtered = filtered.filter(r =>
      (r.estudiante || '').toLowerCase().includes(q) ||
      (r.documento || '').toLowerCase().includes(q)
    )
  }
  return filtered
})
const startIndex = computed(() => (page.value - 1) * rowsPerPage)
const endIndex = computed(() => Math.min(page.value * rowsPerPage, filteredRows.value.length))
const maxPage = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / rowsPerPage)))
const paginatedRows = computed(() => filteredRows.value.slice(startIndex.value, startIndex.value + rowsPerPage))

// Abrir formulario al editar
function handleEdit(row) {
  editFormData.value = { ...row }
  showEditDialog.value = true
}

// Guardar cambios
function saveEdit(updated) {
  const idx = rows.value.findIndex(r => r.index === updated.index)
  if (idx !== -1) rows.value[idx] = { ...rows.value[idx], ...updated }
  showEditDialog.value = false
}

// Cambiar estado
function handleToggleState(row) {
  const idx = rows.value.findIndex(r => r.index === row.index)
  if (idx !== -1) rows.value[idx].active = !rows.value[idx].active
}
</script>

<style scoped>
.group-management-page {
  padding: 16px;
}
.header-section {
  margin-bottom: 18px;
}
.title-row {
  display: flex;
  align-items: center;
}
.main-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2px;
  color: #222;
}
.subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}
.filters-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pagination-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.results-info {
  color: #6b7280;
  font-size: 0.95rem;
}
</style>
