<template>
  <div class="q-pa-md responsive-page">
    <div class="row q-col-gutter-md q-mb-md filters-row">
      <div class="col-12 col-md-4">
        <q-select
          v-model="selectedGrade"
          :options="gradeOptions"
          label="Seleccionar grado"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-4">
        <q-select
          v-model="selectedSubject"
          :options="subjectOptions"
          label="Seleccionar materia"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          v-model="search"
          label="Buscar estudiante"
          outlined
          dense
          class="search-input"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-card class="card-table">
      <q-table
        title="Notas de los Estudiantes"
        :rows="filteredStudents"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination.sync="pagination"
        :rows-per-page-options="[5, 10, 20]"
        :grid="$q.screen.lt.md"
      >
        <template v-slot:top-right>
          <q-btn color="primary" label="Exportar" icon="download" flat dense />
        </template>

        <template v-slot:body-cell-grade="props">
          <q-td :props="props">
            <q-chip
              :color="getGradeColor(props.row.grade)"
              text-color="white"
              class="status-chip"
            >
              {{ props.row.grade }}
            </q-chip>
          </q-td>
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

const gradeOptions = ['1°', '2°', '3°', '4°', '5°']
const subjectOptions = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia']

const selectedGrade = ref(null)
const selectedSubject = ref(null)
const search = ref('')

const students = ref([
  { id: 1, name: 'Juan Pérez', grade: 18 },
  { id: 2, name: 'María López', grade: 12 },
  { id: 3, name: 'Carlos Díaz', grade: 15 },
  { id: 4, name: 'Ana Gómez', grade: 9 },
  { id: 5, name: 'Luis Torres', grade: 20 }
])

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'name', label: 'Estudiante', field: 'name', align: 'left' },
  { name: 'grade', label: 'Nota', field: 'grade', align: 'center' }
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

function getGradeColor(grade) {
  if (grade >= 17) return 'green'
  if (grade >= 13) return 'orange'
  return 'red'
}
</script>

<style scoped>
/* Estilos generales */
.card-table {
  border-radius: 12px;
  overflow: hidden;
}

.search-input {
  width: 100%;
}

.status-chip {
  font-weight: bold;
}

.filters-row {
  flex-wrap: wrap;
}

/* ============= RESPONSIVIDAD ============= */

/* Ajustes para pantallas pequeñas */
@media (max-width: 1024px) {
  .responsive-page {
    padding: 8px !important;
  }

  .card-table {
    margin: 0;
  }

  .search-input {
    width: 100%;
  }

  .q-col-gutter-md {
    display: flex;
    flex-direction: column;
  }
}

/*(celulares) */
@media (max-width: 600px) {
  .text-h6 {
    font-size: 1.1rem;
  }

  .text-subtitle2 {
    font-size: 0.9rem;
  }

  .summary-actions {
    flex-direction: column !important;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .status-chip {
    font-size: 0.8rem;
  }

  .q-pagination {
    justify-content: center;
    width: 100%;
  }
}
</style>
