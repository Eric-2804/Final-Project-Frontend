<template>
  <div class="q-pa-lg">
    <!-- Spinner mientras carga -->
    <div v-if="loading" class="loading-container">
      <q-spinner-cube color="primary" size="90px" />
      <div class="loading-text">Cargando datos...</div>
    </div>

    <div v-else>
      <div class="text-h4 text-bold q-mb-lg title">Gestión de Profesores</div>

      
      <div class="cards-container">
        <q-card class="stat-card card-blue">
          <div class="label">Total</div>
          <div class="value">{{ teachers.length }}</div>
        </q-card>

        <q-card class="stat-card card-green">
          <div class="label">Activos</div>
          <div class="value">{{ activeTeachers }}</div>
        </q-card>

        <q-card class="stat-card card-red">
          <div class="label">Inactivos</div>
          <div class="value">{{ inactiveTeachers }}</div>
        </q-card>
      </div>

      <!-- TABLA -->
      <TableComponent
        :columns="columns"
        :rows="teachers"
        row-key="_id"
        flat
        bordered
      >
        <template #body-cell-isActive="{ row }">
          <q-chip
            dense
            :color="row.isActive ? 'positive' : 'negative'"
            text-color="white"
          >
            {{ row.isActive ? "Activo" : "Inactivo" }}
          </q-chip>
        </template>
      </TableComponent>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import TableComponent from "../components/tables.vue";
  import { getUsersByRol } from "../services/apiteacher";
  import { useNotify } from "../composables/useNotify";
  
  const { showNotify, showErrorNotify } = useNotify();
  
  const teachers = ref([]);
  const loading = ref(true);
  
  const columns = [
    { name: "names", label: "Nombres", field: "names", align: "left" },
    { name: "lastNames", label: "Apellidos", field: "lastNames", align: "left" },
    { name: "email", label: "Correo", field: "email", align: "left" },
    { name: "roles", label: "Rol", field: "roles", align: "left" },
    { name: "isActive", label: "Estado", field: "isActive", align: "center" },
  ];
  
  const activeTeachers = computed(() =>
    teachers.value.filter(t => t.isActive).length
  );
  
  const inactiveTeachers = computed(() =>
    teachers.value.filter(t => !t.isActive).length
  );
  
  const loadTeachers = async () => {
    try {
      const res = await getUsersByRol("profesor");
  
      // Validación por si Render no devuelve usuarios
      if (!res || !res.users) {
        showErrorNotify({
          message: "El servidor no devolvió datos. Puede estar dormido."
        });
        teachers.value = [];
        return;
      }
  
      teachers.value = res.users;
  
      showNotify({
        message: "Profesores cargados correctamente"
      });
  
    } catch (err) {
      console.error("Error cargando profesores:", err);
  
      const msg =
        err.response?.data?.msg ||
        err.message ||
        "No se pudo conectar al servidor";
  
      showErrorNotify({
        message: `Error cargando profesores: ${msg}`,
        color: "negative",
        timeout: 4000
      });
  
      teachers.value = []; 
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(loadTeachers);
  </script>
  

<style scoped>
.loading-container {
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-text {
  margin-top: 20px;
  font-size: 20px;
  color: #1a237e;
}

.title {
  text-align: left;
  margin-bottom: 30px;
  margin-left: 30px;
}

.cards-container {
  display: flex;
  gap: 20px;
  justify-content: left;
  margin-bottom: 40px;
  flex-wrap: wrap;
  margin-left: 130px;
}

.stat-card {
  width: 250px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 14px rgb(90, 87, 87);
  transition: 0.2s ease-in-out;
  margin-right: 80px;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.card-blue {
  background: linear-gradient(135deg, #2962ff, #6e92ff);
}

.card-green {
  background: linear-gradient(135deg, #0baa4b, #66d27a);
}

.card-red {
  background: linear-gradient(135deg, #e53935, #ff8a80);
}

.label {
  font-size: 20px;
  opacity: 0.9;
}

.value {
  font-size: 32px;
  font-weight: bold;
  margin-top: 5px;
}
</style>
