<template>
  <div class="q-pa-md">
    <q-card flat bordered class="card-table">
      <!-- Encabezado -->
      <q-card-section class="row items-center justify-between q-px-lg q-pt-lg">
        <div>
          <div class="text-h6">Gestión de Profesores</div>
          <div class="text-subtitle2 text-grey">
            Administra los datos de los profesores registrados
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-btn flat round dense icon="add" color="primary" @click="openDialog" label="Nuevo" />
        </div>
      </q-card-section>

      <!-- Tabla principal -->
      <q-card-section v-if="!loading" class="q-pt-none q-px-lg">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-input
              filled
              v-model="search"
              dense
              placeholder="Buscar profesor..."
              clearable
              :append="[{ icon: 'search' }]"
            />
          </div>
        </div>

        <q-table
          flat
          separator="horizontal"
          :rows="filteredTeachers"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :rows-per-page-options="[6, 10, 20]"
          class="styled-table"
          :grid="$q.screen.lt.md"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat icon="edit" color="primary" @click="editTeacher(props.row)" />
              <q-btn flat icon="delete" color="negative" @click="deleteTeacher(props.row.id)" />
            </q-td>
          </template>

          <template v-slot:bottom="scope">
            <div class="row items-center q-pa-sm justify-between full-width">
              <div class="text-caption text-grey">
                Mostrando {{ startIndex }}-{{ endIndex }} de {{ filteredTeachers.length }} resultados
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

    <!-- Diálogo para agregar/editar profesor -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editing ? 'Editar Profesor' : 'Agregar Profesor' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input filled v-model="teacherForm.name" label="Nombre completo" class="q-mb-sm" />
          <q-input filled v-model="teacherForm.email" label="Correo electrónico" class="q-mb-sm" />
          <q-input filled v-model="teacherForm.subject" label="Materia asignada" class="q-mb-sm" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveTeacher"
          />
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
const teacherForm = ref({ id: null, name: "", email: "", subject: "" });

const teachers = ref([
  { id: 1, name: "Laura Pérez", email: "laura.perez@colegio.edu", subject: "Matemáticas" },
  { id: 2, name: "Carlos Gómez", email: "carlos.gomez@colegio.edu", subject: "Lenguaje" },
  { id: 3, name: "Marta López", email: "marta.lopez@colegio.edu", subject: "Ciencias" },
]);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1200);
});

const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left", sortable: true },
  { name: "email", label: "Correo", field: "email", align: "left", sortable: true },
  { name: "subject", label: "Materia", field: "subject", align: "left", sortable: true },
  { name: "actions", label: "Acciones", align: "center" },
];

const search = ref("");
const pagination = ref({ page: 1, rowsPerPage: 6 });

const filteredTeachers = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return teachers.value;
  return teachers.value.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
  );
});

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredTeachers.value.length / pagination.value.rowsPerPage))
);
const startIndex = computed(() => {
  const p = pagination.value.page;
  const per = pagination.value.rowsPerPage;
  return filteredTeachers.value.length === 0 ? 0 : (p - 1) * per + 1;
});
const endIndex = computed(() =>
  Math.min(filteredTeachers.value.length, pagination.value.page * pagination.value.rowsPerPage)
);

function openDialog() {
  editing.value = false;
  teacherForm.value = { id: null, name: "", email: "", subject: "" };
  dialog.value = true;
}

function editTeacher(teacher) {
  editing.value = true;
  teacherForm.value = { ...teacher };
  dialog.value = true;
}

function saveTeacher() {
  if (!teacherForm.value.name || !teacherForm.value.email || !teacherForm.value.subject) {
    $q.notify({ type: "negative", message: "Completa todos los campos" });
    return;
  }

  if (editing.value) {
    const index = teachers.value.findIndex((t) => t.id === teacherForm.value.id);
    teachers.value[index] = { ...teacherForm.value };
    $q.notify({ type: "positive", message: "Profesor actualizado correctamente" });
  } else {
    const newId = teachers.value.length
      ? Math.max(...teachers.value.map((t) => t.id)) + 1
      : 1;
    teachers.value.push({ id: newId, ...teacherForm.value });
    $q.notify({ type: "positive", message: "Profesor agregado correctamente" });
  }

  dialog.value = false;
}

function deleteTeacher(id) {
  teachers.value = teachers.value.filter((t) => t.id !== id);
  $q.notify({ type: "warning", message: "Profesor eliminado" });
}
</script>

<style scoped>
.card-table {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
  border: 1px solid #e6e9ee;
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
