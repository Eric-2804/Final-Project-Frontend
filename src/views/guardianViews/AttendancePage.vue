<template>
  <div class="q-pa-md responsive-page">
    <!-- Tabla de estudiantes -->
    <q-card class="card-table">
      <q-table
        title="Mis Estudiantes"
        :rows="students"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        :pagination.sync="pagination"
        :rows-per-page-options="[5, 10, 20]"
        :grid="$q.screen.lt.md"
      >
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import axios from 'axios'

const auth = useAuthStore()
const students = ref([])

const columns = [
  { name: 'name', label: 'Estudiante', field: (row) => `${row.names} ${row.lastNames}`, align: 'left' },
]

const pagination = ref({
  page: 1,
  rowsPerPage: 5
})

onMounted(async () => {
  if (auth.user && auth.user.id) {
    try {
      const response = await axios.get(`http://localhost:3000/api/registration/students-by-attendant/${auth.user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      students.value = response.data.data;
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }
});

</script>

<style scoped>
.card-table {
  border-radius: 12px;
  overflow: hidden;
}

/* RESPONSIVIDAD */

/* Tablets */
@media (max-width: 1024px) {
  .responsive-page {
    padding: 8px !important;
  }
}

/* Celulares */
@media (max-width: 600px) {
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