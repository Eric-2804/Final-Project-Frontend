<template>
  <div class="q-pa-md responsive-page">
    <!-- Filtros superiores -->
    <div class="row q-col-gutter-md q-mb-md filters-row">
      <div class="col-12 col-md-4">
        <q-select
          v-model="selectedClass"
          :options="classOptions"
          label="Seleccionar curso"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          v-model="date"
          label="Fecha"
          outlined
          dense
          type="date"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-btn
          color="primary"
          icon="search"
          label="Buscar"
          class="full-width"
          @click="filterAttendance"
        />
      </div>
    </div>

    <!-- Tabla de asistencia -->
    <q-card class="card-table">
      <q-table
        title="Registro de Asistencia"
        :rows="filteredStudents"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination.sync="pagination"
        :rows-per-page-options="[5, 10, 20]"
        :grid="$q.screen.lt.md"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.status === 'Presente' ? 'green' : 'red'"
              text-color="white"
              class="status-chip"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:top-right>
          <q-btn color="positive" label="Guardar Cambios" icon="save" flat dense />
        </template>

        <template v-slot:bottom="props">
          <div class="row justify-between items-center q-pa-sm summary-actions">
            <div class="text-caption">
              Mostrando {{ props.pagination.rowsPerPage }} de {{ props.pagination.rowsNumber }} estudiantes
            </div>
            <q-pagination
              v-model="props.pagination.page"
              :max="props.pagesNumber"
              boundary-links
              color="primary"
              class="q-ml-md"
            />
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const classOptions = ['1°A', '2°B', '3°C', '4°D', '5°E']
const selectedClass = ref(null)
const date = ref('')
const search = ref('')

const students = ref([
  { id: 1, name: 'Juan Pérez', status: 'Presente' },
  { id: 2, name: 'María López', status: 'Ausente' },
  { id: 3, name: 'Carlos Díaz', status: 'Presente' },
  { id: 4, name: 'Ana Gómez', status: 'Presente' },
  { id: 5, name: 'Luis Torres', status: 'Ausente' }
])
 
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'name', label: 'Estudiante', field: 'name', align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 5
})

const filteredStudents = computed(() => {
  return students.value.filter(s =>
    s.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

function filterAttendance() {
  console.log('Filtrando asistencia de', selectedClass.value, 'para la fecha', date.value)
}
</script>

<style scoped>
.card-table {
  border-radius: 12px;
  overflow: hidden;
}

.status-chip {
  font-weight: bold;
}

.filters-row {
  flex-wrap: wrap;
}

/* RESPONSIVIDAD */

/* Tablets */
@media (max-width: 1024px) {
  .responsive-page {
    padding: 8px !important;
  }

  .q-btn.full-width {
    width: 100%;
  }
}

/* Celulares */
@media (max-width: 600px) {
  .filters-row {
    flex-direction: column !important;
  }

  .q-select,
  .q-input,
  .q-btn {
    width: 100%;
  }

  .status-chip {
    font-size: 0.8rem;
  }

  .summary-actions {
    flex-direction: column !important;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .q-pagination {
    width: 100%;
    justify-content: center;
  }
}
</style>
