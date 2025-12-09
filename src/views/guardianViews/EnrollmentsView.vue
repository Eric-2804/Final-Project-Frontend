<template>
  <q-page class="q-pa-md">

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6">Mis Matrículas</div>
        <div class="text-caption text-grey-7">Año: {{ currentYear }}</div>
      </div>
    </div>

    <!-- SPINNER -->
    <div v-if="loading" class="q-pa-xl q-mb-md">
      <Spinner />
    </div>

    <!-- TABLA -->
    <div v-else>
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        class="shadow-1"
        dense
      >
        <template v-slot:body-cell-studentName="props">
          <q-td :props="props">
            {{ props.row.studentName || 'Desconocido' }}
          </q-td>
        </template>

        <template v-slot:body-cell-groupLabel="props">
          <q-td :props="props">
            {{ props.row.groupLabel || 'N/A' }}
          </q-td>
        </template>

        <template v-slot:body-cell-registrationDate="props">
          <q-td :props="props">
            {{ props.row.registrationDate || '-' }}
          </q-td>
        </template>

        <template v-slot:body-cell-state="props">
          <q-td :props="props" class="text-center">
            <q-chip dense outline :color="props.row.state === 'Activo' ? 'positive' : 'grey'">
              {{ props.row.state }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn dense round size="sm" icon="visibility" title="Ver detalles" @click="viewDetails(props.row)" />
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="text-center q-pa-md">
            No se encontraron matrículas para el año {{ currentYear }}.
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Spinner from "@/components/Spinner.vue";
import { useNotify } from "@/composables/useNotify";
import registrationService from '@/services/guardianServices/registrationService';
import { useAuthStore } from '../../stores/auth.js';

const router = useRouter();
const { showNotify, showErrorNotify } = useNotify();
const auth = useAuthStore();

const loading = ref(false);
const currentYear = new Date().getFullYear();
const rows = ref([]);

const columns = [
  { name: "studentName", label: "Estudiante", field: "studentName", align: "left" },
  { name: "groupLabel", label: "Grupo", field: "groupLabel", align: "left" },
  { name: "state", label: "Estado", field: "state", align: "center" },
  { name: "registrationDate", label: "Fecha Matrícula", field: "registrationDate", align: "left" },
  { name: "actions", label: "Acciones", field: "actions", align: "center" }
];

function handleApiError(err, defaultMsg = "Error en la operación") {
  const msg = err?.response?.data?.msg || err?.response?.data?.error || err?.message || defaultMsg;
  showErrorNotify(msg);
}

onMounted(() => {
  loadEnrollments();
});

async function loadEnrollments() {
  loading.value = true;
  rows.value = [];
  try {
    const res = await registrationService.getByAttendant(auth.user._id);

    const registrations = res.data.data;

    if (registrations && registrations.length > 0) {
        rows.value = registrations.map((reg) => ({
            id: reg._id,
            studentName: reg.student ? `${reg.student.names} ${reg.student.lastNames}` : "Sin estudiante",
            groupLabel: reg.group ? `${reg.group.name}` : "Sin grupo",
            state: reg.state,
            registrationDate: reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : "-",
        }));
        showNotify("Matrículas cargadas.");
    } else {
        showNotify("No se encontraron matrículas.");
    }

  } catch (err) {
    handleApiError(err, "Error cargando matrículas");
  } finally {
    loading.value = false;
  }
}

function viewDetails(row) {
  router.push({ name: 'EnrollmentsDetailsView', params: { id: row.id } });
}

</script>

<style scoped>
.shadow-1 {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
</style>