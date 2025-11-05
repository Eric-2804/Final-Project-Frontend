<template>
  <div class="q-pa-md">
    <q-card flat bordered class="card-table">
      <q-card-section class="row items-center justify-between q-px-lg q-pt-lg">
        <div>
          <div class="text-h6">Calificaciones</div>
          <div class="text-subtitle2 text-grey">Gestión de calificaciones por periodo</div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-btn flat round dense icon="filter_list" class="hide-mobile" />
        </div>
      </q-card-section>

      <q-card-section v-if="!loading" class="q-pt-none q-px-lg">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-select filled v-model="selectedYear" :options="years" label="Seleccionar Año" dense />
          </div>

          <div class="col-12 col-md-4">
            <q-select filled v-model="selectedPeriod" :options="periods" label="Seleccionar Periodo" dense />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              filled
              v-model="search"
              dense
              placeholder="Buscar materias..."
              clearable
              class="search-input"
              :append="[{ icon: 'search' }]"
            />
          </div>
        </div>

        <q-table
          flat
          separator="horizontal"
          :rows="filteredGrades"
          :columns="columns"
          row-key="subject"
          :pagination.sync="pagination"
          :rows-per-page-options="[6, 10, 20]"
          class="styled-table"
          :grid="$q.screen.lt.md"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                dense
                outline
                :color="props.row.status === 'Aprobado' ? 'green-3' : 'red-3'"
                text-color="black"
                class="status-chip"
              >
                {{ props.row.status }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:bottom="scope">
            <div class="row items-center q-pa-sm justify-between full-width">
              <div class="text-caption text-grey">
                Mostrando {{ startIndex }}-{{ endIndex }} de {{ filteredGrades.length }} resultados
              </div>
              <q-pagination
                v-model="pagination.page"
                :max="pageCount"
                max-pages="7"
                boundary-numbers
                class="no-border"
                color="primary"
                size="md"
              />
            </div>
          </template>
        </q-table>

        <div class="q-mt-md row items-center justify-between summary-actions">
          <div class="row items-center q-gutter-md">
            <div>
              <strong>Promedio del Periodo:</strong> {{ periodAverage }}
            </div>
            <div>
              <strong>Estado:</strong> {{ periodStatus }}
            </div>
          </div>

          <div>
            <Button label="Descargar PDF" icon="picture_as_pdf" color="primary" @click="downloadPDF" :loading="isDownloading" />
          </div>
        </div>
      </q-card-section>
      <div v-else class="q-pa-xl text-center">
        <Spinner size="5em" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useNotify } from '../composables/useNotify'
import Button from '../components/Button.vue'
import Spinner from '../components/Spinner.vue'

const $q = useQuasar()
const { showNotify, showErrorNotify } = useNotify()
const loading = ref(true)
const isDownloading = ref(false)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)
})

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i)
const periods = ['Periodo 1', 'Periodo 2', 'Periodo 3', 'Periodo 4']

const selectedYear = ref(currentYear)
const selectedPeriod = ref('Periodo 1')

const columns = [
  { name: 'subject', required: true, label: 'Materia', align: 'left', field: 'subject', sortable: true },
  { name: 'grade', label: 'Nota', field: 'grade', sortable: true, align: 'center' },
  { name: 'evaluation', label: 'Juicio Valorativo', field: 'evaluation', align: 'left' },
  { name: 'teacher', label: 'Profesor', field: 'teacher', align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' }
]

const grades = ref([
  { subject: 'Matemáticas', grade: 4.5, evaluation: 'Excelente desempeño', teacher: 'Profesor A', status: 'Aprobado' },
  { subject: 'Lenguaje', grade: 3.8, evaluation: 'Buen trabajo', teacher: 'Profesor B', status: 'Aprobado' },
  { subject: 'Ciencias', grade: 2.5, evaluation: 'Necesita mejorar', teacher: 'Profesor C', status: 'Reprobado' },
  { subject: 'Sociales', grade: 4.8, evaluation: 'Desempeño superior', teacher: 'Profesor D', status: 'Aprobado' }
])

const search = ref('')

const pagination = ref({
  page: 1,
  rowsPerPage: 6
})
  
const filteredGrades = computed(() => {
  const q = search.value && search.value.toString().toLowerCase().trim()
  let list = grades.value.slice()

  if (q) {
    list = list.filter(item =>
      String(item.subject).toLowerCase().includes(q) ||
      String(item.teacher).toLowerCase().includes(q) ||
      String(item.evaluation).toLowerCase().includes(q)
    )
  }
  return list
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredGrades.value.length / pagination.value.rowsPerPage)))
const startIndex = computed(() => {
  const p = pagination.value.page
  const per = pagination.value.rowsPerPage
  return filteredGrades.value.length === 0 ? 0 : (p - 1) * per + 1
})
const endIndex = computed(() => Math.min(filteredGrades.value.length, pagination.value.page * pagination.value.rowsPerPage))

const periodAverage = computed(() => {
  if (grades.value.length === 0) return '0.00'
  const total = grades.value.reduce((acc, item) => acc + item.grade, 0)
  return (total / grades.value.length).toFixed(2)
})

const periodStatus = computed(() => {
  return parseFloat(periodAverage.value) >= 3.0 ? 'Aprobado' : 'Reprobado'
})

async function downloadPDF() {
  isDownloading.value = true
  showNotify('Descargando boletín en formato PDF...', 'positive', 'cloud_download')

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    showNotify('Boletín descargado exitosamente', 'positive', 'check_circle')
  } catch (error) {
    showErrorNotify('Error al descargar el boletín')
  } finally {
    isDownloading.value = false
  }
}
</script>

<style scoped>
.q-table th {
  font-weight: bold;
}

.card-table {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
  border: 1px solid #e6e9ee;
}

.search-input {
  width: 100%;
}

.styled-table .q-table__bottom {
  border-top: 0;
}
.styled-table .q-tr > td {
  padding: 16px 12px;
}

.status-chip {
  border-radius: 999px;
  padding-left: 8px;
  padding-right: 8px;
  font-weight: 600;
}

.hide-mobile {
  display: inline-flex;
}

@media (max-width: 600px) {
  .hide-mobile {
    display: none;
  }
  .summary-actions {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
