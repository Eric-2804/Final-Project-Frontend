<template>
  <div class="q-pa-md">
    <q-card flat bordered class="card-table">
      <q-card-section class="row items-center justify-between q-px-lg q-pt-lg">
        <div>
          <div class="text-h6">Gestión de Matrículas</div>
          <div class="text-subtitle2 text-grey">
            Administra los registros de matrícula de los estudiantes
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-btn flat round dense icon="add" color="primary" label="Nueva Matrícula" @click="openDialog" />
        </div>
      </q-card-section>
 
      <!-- Tabla -->
      <q-card-section v-if="!loading" class="q-pt-none q-px-lg">
        <!-- Búsqueda -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              filled
              v-model="search"
              dense
              placeholder="Buscar estudiante, curso o año..."
              clearable
              :append="[{ icon: 'search' }]"
            />
          </div>
        </div>

        <q-table
          flat
          separator="horizontal"
          :rows="filteredEnrollments"
          :columns="columns"
          row-key="id"
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
                :color="props.row.status === 'Activa' ? 'green-3' : 'red-3'"
                text-color="black"
                class="status-chip"
              >
                {{ props.row.status }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat icon="edit" color="primary" @click="editEnrollment(props.row)" />
              <q-btn flat icon="delete" color="negative" @click="deleteEnrollment(props.row.id)" />
            </q-td>
          </template>

          <template v-slot:bottom="scope">
            <div class="row items-center q-pa-sm justify-between full-width">
              <div class="text-caption text-grey">
                Mostrando {{ startIndex }}-{{ endIndex }} de {{ filteredEnrollments.length }} resultados
              </div>
              <q-pagination
                v-model="pagination.page"
                :max="pageCount"
                max-pages="7"
                boundary-numbers
                color="primary"
                size="md"
              />
            </div>
          </template>
        </q-table>
      </q-card-section>

      <div v-else class="q-pa-xl text-center">
        <Spinner size="5em" />
      </div>
    </q-card>

    <!-- Diálogo para agregar/editar matrícula -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editing ? 'Editar Matrícula' : 'Nueva Matrícula' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input filled v-model="enrollmentForm.student" label="Nombre del estudiante" class="q-mb-sm" />
          <q-input filled v-model="enrollmentForm.grade" label="Grado o curso" class="q-mb-sm" />
          <q-input filled v-model="enrollmentForm.year" label="Año" class="q-mb-sm" />
          <q-select
            filled
            v-model="enrollmentForm.status"
            :options="['Activa', 'Inactiva']"
            label="Estado"
            class="q-mb-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveEnrollment" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import Spinner from "../components/Spinner.vue";

const $q = useQuasar();
const loading = ref(true);
const dialog = ref(false);
const editing = ref(false);

const enrollmentForm = ref({
  id: null,
  student: "",
  grade: "",
  year: "",
  status: "Activa",
});

const enrollments = ref([
  { id: 1, student: "Juan Torres", grade: "5°A", year: "2025", status: "Activa" },
  { id: 2, student: "María López", grade: "6°B", year: "2025", status: "Activa" },
  { id: 3, student: "Carlos Díaz", grade: "4°A", year: "2024", status: "Inactiva" },
]);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1200);
});

const columns = [
  { name: "student", label: "Estudiante", field: "student", align: "left", sortable: true },
  { name: "grade", label: "Grado", field: "grade", align: "left", sortable: true },
  { name: "year", label: "Año", field: "year", align: "center", sortable: true },
  { name: "status", label: "Estado", field: "status", align: "center" },
  { name: "actions", label: "Acciones", align: "center" },
];

const search = ref("");
const pagination = ref({ page: 1, rowsPerPage: 6 });

const filteredEnrollments = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return enrollments.value;
  return enrollments.value.filter(
    (e) =>
      e.student.toLowerCase().includes(q) ||
      e.grade.toLowerCase().includes(q) ||
      e.year.toString().includes(q)
  );
});

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredEnrollments.value.length / pagination.value.rowsPerPage))
);
const startIndex = computed(() => {
  const p = pagination.value.page;
  const per = pagination.value.rowsPerPage;
  return filteredEnrollments.value.length === 0 ? 0 : (p - 1) * per + 1;
});
const endIndex = computed(() =>
  Math.min(filteredEnrollments.value.length, pagination.value.page * pagination.value.rowsPerPage)
);

function openDialog() {
  editing.value = false;
  enrollmentForm.value = { id: null, student: "", grade: "", year: "", status: "Activa" };
  dialog.value = true;
}

function editEnrollment(enrollment) {
  editing.value = true;
  enrollmentForm.value = { ...enrollment };
  dialog.value = true;
}

function saveEnrollment() {
  if (!enrollmentForm.value.student || !enrollmentForm.value.grade || !enrollmentForm.value.year) {
    $q.notify({ type: "negative", message: "Completa todos los campos" });
    return;
  }

  if (editing.value) {
    const index = enrollments.value.findIndex((e) => e.id === enrollmentForm.value.id);
    enrollments.value[index] = { ...enrollmentForm.value };
    $q.notify({ type: "positive", message: "Matrícula actualizada correctamente" });
  } else {
    const newId = enrollments.value.length
      ? Math.max(...enrollments.value.map((e) => e.id)) + 1
      : 1;
    enrollments.value.push({ id: newId, ...enrollmentForm.value });
    $q.notify({ type: "positive", message: "Matrícula agregada correctamente" });
  }

  dialog.value = false;
}

function deleteEnrollment(id) {
  enrollments.value = enrollments.value.filter((e) => e.id !== id);
  $q.notify({ type: "warning", message: "Matrícula eliminada" });
}
</script>

<style scoped>
.card-table {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
  border: 1px solid #e6e9ee;
}

.status-chip {
  border-radius: 999px;
  padding: 0 8px;
  font-weight: 600;
}

.styled-table .q-tr > td {
  padding: 14px 10px;
}

@media (max-width: 600px) {
  .q-card-section .text-h6 {
    font-size: 1rem;
  }
}
</style>
