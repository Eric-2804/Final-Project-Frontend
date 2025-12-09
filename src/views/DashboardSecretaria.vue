<template>
  <div class="q-pa-md">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-cube color="primary" size="5.5em" />
      <div class="q-ml-md text-h6">Cargando datos...</div>
    </div>

    <div v-else-if="error" class="text-center">
      <q-icon name="error" color="negative" size="4em" />
      <div class="text-h6 text-negative">Error al cargar el dashboard</div>
      <p>{{ error }}</p>
      <q-btn
        label="Reintentar"
        color="primary"
        @click="loadDashboard"
        icon="refresh"
      />
    </div>

    <div v-else>
      <q-card class="q-mb-md" flat bordered>
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h5">
              Bienvenida, {{ authStore.user?.name || '' }} {{ authStore.user?.lastName || '' }}
            </div>
            <div class="text-subtitle1 text-grey-7">
              {{ getRoleName(authStore.user?.rol) }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-subtitle2">Vigencia Actual</div>
            <div class="text-h6">
              {{ dashboardData?.vigenciaActiva?.nombre || 'No definida' }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md q-mb-md">
        <!-- Tarjeta: Total de Estudiantes -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-blue-1 text-center">
            <q-card-section>
              <q-icon name="groups" size="3em" color="blue-8" />
              <div class="text-h4 q-mt-sm">{{ dashboardData?.totalEstudiantes || 0 }}</div>
              <div class="text-subtitle2 text-grey-8">Total Estudiantes</div>
            </q-card-section>
          </q-card>
        </div> 
        <!-- Tarjeta: Total de Docentes -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-green-1 text-center">
            <q-card-section>
              <q-icon name="school" size="3em" color="green-8" />
              <div class="text-h4 q-mt-sm">{{ dashboardData?.totalDocentes || 0 }}</div>
              <div class="text-subtitle2 text-grey-8">Total Docentes</div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Tarjeta: Matrículas Pendientes -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-orange-1 text-center">
            <q-card-section>
              <q-icon name="assignment_late" size="3em" color="orange-8" />
              <div class="text-h4 q-mt-sm">{{ dashboardData?.matriculasPendientes || 0 }}</div>
              <div class="text-subtitle2 text-grey-8">Matrículas Pendientes</div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Tarjeta: Sedes Activas -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-purple-1 text-center">
            <q-card-section>
              <q-icon name="business" size="3em" color="purple-8" />
              <div class="text-h4 q-mt-sm">
                {{ dashboardData?.sedesActivas || 0 }}
              </div>
              <div class="text-subtitle2 text-grey-8">Sedes Activas</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">Últimos Usuarios Registrados</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-table
            :rows="dashboardData?.ultimosUsuarios || []"
            :columns="userColumns"
            row-key="id"
            flat
            dense
            :rows-per-page-options="[5, 10]"
            no-data-label="No se encontraron usuarios recientes."
          >
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-7 q-gutter-sm q-pa-lg">
                <q-icon size="2em" name="sentiment_dissatisfied" />
                <span>No se encontraron usuarios recientes.</span>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api'; // Asumiendo que tienes un servicio api configurado
import { useQuasar } from 'quasar';

const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref(null);
const dashboardData = ref(null);

const userColumns = [
  { name: 'fullName', label: 'Nombre Completo', align: 'left', field: row => `${row.name} ${row.lastName}`, sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'registrationDate', label: 'Fecha de Registro', align: 'left', field: 'registrationDate', sortable: true },
];

const getRoleName = (role) => {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const loadDashboard = async () => {
  loading.value = true;
  error.value = null;
  try {
    // NOTA: El endpoint 'secretaria/dashboard' es un ejemplo. 
    // Deberás crearlo en tu backend para que devuelva los datos necesarios.
    const response = await api.get('/secretaria/dashboard');
    dashboardData.value = response.data;
  } catch (err) {
    error.value = 'No se pudieron cargar los datos del dashboard. Por favor, inténtalo de nuevo más tarde.';
    console.error(err);
    $q.notify({
      type: 'negative',
      message: error.value,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Por ahora, simularemos la carga para evitar errores ya que el endpoint no existe.
  // Quita el comentario de loadDashboard() cuando el endpoint esté listo.
  // loadDashboard(); 
  
  // Datos de simulación:
  dashboardData.value = {
    vigenciaActiva: { nombre: '2024' },
    totalEstudiantes: 1250,
    totalDocentes: 85,
    matriculasPendientes: 15,
    sedesActivas: 4,
  };
  loading.value = false;
});
</script>

<style scoped>
.stat-card {
  transition: transform 0.3s, box-shadow 0.3s;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
</style>