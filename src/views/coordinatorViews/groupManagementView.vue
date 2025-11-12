<template>
  <FlexibleLayout>
    <template #default>
      <div class="group-management-page">
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

        <!-- Aquí usamos el componente Tables -->
        <Tables
          :columns="columns"
          :rows="paginatedRows"
          :actions="true"
          @edit="handleEdit"
          @toggleState="handleToggleState"
        />

        <!-- Paginación local (la tabla muestra solo paginatedRows) -->
        <div class="pagination-row q-mt-md row items-center justify-end">
          <div class="results-info q-mr-md">Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredRows.length }}</div>
          <q-pagination v-model="page" :max="maxPage" color="primary" />
        </div>
      </div>
    </template>
  </FlexibleLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import FlexibleLayout from '../../layouts/FlexibleLayout.vue'
import Tables from '../../components/tables.vue' // ruta relativa desde views

// Opciones de grupos (las que ya tenías)
const groupOptions = [
  'Grupo 6A',
  'Grupo 6B',
  'Grupo 7A',
  'Grupo 7B'
]
const selectedGroup = ref(groupOptions[0])

// Buscador / paginación
const search = ref('')
const page = ref(1)
const rowsPerPage = 5

// Datos (he preservado los ejemplos que estaban en la vista original)
const rows = ref([
  { index: 1, estudiante: 'Ana Sofia Becerra', documento: '10051...erra', telefono: '3101234567', correo: 'carlos.b@example.com', active: true },
  { index: 2, estudiante: 'Benjamin Corzo Diaz', documento: '100... Diaz', telefono: '3112345678', correo: 'laura.d@example.com', active: true },
  { index: 3, estudiante: 'Camila Fuentes Gil', documento: '1005...tes', telefono: '3123456789', correo: 'roberto.f@example.com', active: false },
  { index: 4, estudiante: 'Daniela Gomez Parra', documento: '100...ra', telefono: '3134567890', correo: 'patricia.p@example.com', active: true },
  { index: 5, estudiante: 'Esteban Rojas Lopez', documento: '1005567890', acudiente: 'Marta Lopez', telefono: '3145678900', correo: 'marta.l@example.com', active: true }
  // Si tienes más datos, añádelos aquí o conéctalo al API más adelante.
])

const columns = [
  { name: 'index', label: '#', field: 'index', align: 'left', sortable: false },
  { name: 'estudiante', label: 'Estudiante', field: 'estudiante', align: 'left', sortable: true },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left', sortable: true },
  { name: 'acudiente', label: 'Acudiente', field: 'acudiente', align: 'left', sortable: true },
  { name: 'telefono', label: 'Teléfono Acudiente', field: 'telefono', align: 'left', sortable: false },
  { name: 'correo', label: 'Correo Acudiente', field: 'correo', align: 'left', sortable: false },
  // Puedes dejar actions como columna virtual si tables.vue la usa internamente para botones.
  { name: 'actions', label: 'Acciones', field: 'actions', sortable: false, align: 'center' }
]

// Cálculo de índices y filtrado
const startIndex = computed(() => (page.value - 1) * rowsPerPage)
const endIndex = computed(() => Math.min(page.value * rowsPerPage, filteredRows.value.length))
const maxPage = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / rowsPerPage)))

const filteredRows = computed(() => {
  let filtered = rows.value
  // filtro por texto
  if (search.value) {
    const q = search.value.toLowerCase()
    filtered = filtered.filter(r => (r.estudiante || '').toLowerCase().includes(q) || (r.documento || '').toLowerCase().includes(q))
  }
  // filtro por grupo (si tu lógica real requiere otro criterio, adáptalo)
  if (selectedGroup.value) {
    // Actualmente los datos de ejemplo no están ligados a grupo; esto es un placeholder.
    // Si tienes un campo group en tus filas, cambiar la condición por: filtered = filtered.filter(r => r.group === selectedGroup.value)
  }
  return filtered
})

const paginatedRows = computed(() => filteredRows.value.slice(startIndex.value, startIndex.value + rowsPerPage))

// helpers para mostrar en UI
const startIndexNumber = computed(() => startIndex.value)
const endIndexNumber = computed(() => endIndex.value)

// Handlers para eventos emitidos por tables.vue
function handleEdit(row) {
  // comportamiento no destructivo: ahora solo registramos; puedes abrir modal/route de edición aquí.
  console.log('[groupManagement] editar', row)
  // ej: router.push({ name: 'EditStudent', params: { id: row.index } })
}

function handleToggleState(row) {
  console.log('[groupManagement] toggleState', row)
  // actualizamos el estado localmente para que la UI refleje cambio
  const idx = rows.value.findIndex(r => r.index === row.index)
  if (idx !== -1) {
    rows.value[idx].active = !rows.value[idx].active
  }
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
