<template>
  <div class="q-pa-lg">
    <!-- Spinner mientras carga -->
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="90px" />
      <div class="loading-text">Cargando datos...</div>
    </div>

    <div v-else>
      <div class="container-card">
      <div class="text-h4 title">Bienvenido a gestión de Profesores</div>
      </div>

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



<div class="container-card">

      <div class="text-h4 text-bold q-mb-lg title">Listado de profesores</div>

      <!-- TABLA -->
      <TableComponent
        :columns="columns"
        :rows="teachers"
        row-key="_id"
        flat
        bordered
      >
        <template #body-cell-status="{ row }">
          <q-td class="text-center">
            <q-chip
              dense
              :color="row.isActive ? 'positive' : 'negative'"
              text-color="white"
            >
              {{ row.isActive ? "Activo" : "Inactivo" }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-actions="{ row }">
          <q-td class="text-center">
            <q-toggle
              :model-value="row.isActive"
              @update:model-value="(val) => toggleTeacherStatus(row._id, val)"
              color="positive"
              size="sm"
            />
          </q-td>
        </template>
      </TableComponent>
    </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import TableComponent from "../components/tables.vue";
  import { getUsersByRol, activateUser, desactivateUser } from "../services/apiteacher";
  import { useNotify } from "../composables/useNotify";
  
  const { showNotify, showErrorNotify } = useNotify();
  
  const teachers = ref([]);
  const loading = ref(true);
  
  const columns = [
    { name: "names", label: "Nombres", field: "names", align: "left" },
    { name: "lastNames", label: "Apellidos", field: "lastNames", align: "left" },
    { name: "email", label: "Correo", field: "email", align: "left" },
    { name: "roles", label: "Rol", field: "roles", align: "left" },
    { name: "status", label: "Estado", field: "isActive", align: "center" },
    { name: "actions", label: "Acciones", field: "actions", align: "center" },
  ];
  
  const activeTeachers = computed(() =>
    teachers.value.filter((t) => t.isActive === true).length
  );
  
  const inactiveTeachers = computed(() =>
    teachers.value.filter((t) => t.isActive === false).length
  );
  
  const loadTeachers = async () => {
    try {
      const res = await getUsersByRol("profesor");
  
      const data =
        res?.users ||
        res?.data?.users ||
        res?.data ||
        res ||
        [];
  
      if (!Array.isArray(data)) {
        throw new Error("El servidor no devolvió una lista válida");
      }
  
      teachers.value = data;
  
      showNotify({ message: "Profesores cargados correctamente" });
  
    } catch (err) {
  
      showErrorNotify({
        message:
          err.response?.data?.msg ||
          err.message ||
          "No se pudieron cargar los profesores."
      });
  
      teachers.value = [];
    } finally {
      loading.value = false;
    }
  };

  const toggleTeacherStatus = async (teacherId, newStatus) => {
    try {
      if (newStatus) {
        await activateUser(teacherId);
        showNotify({ message: "Profesor activado correctamente" });
      } else {
        await desactivateUser(teacherId);
        showNotify({ message: "Profesor desactivado correctamente" });
      }

      // Actualizar el estado local
      const teacher = teachers.value.find(t => t._id === teacherId);
      if (teacher) {
        teacher.isActive = newStatus;
      }

    } catch (err) {
      showErrorNotify({
        message: err.response?.data?.msg || "No se pudo cambiar el estado del profesor"
      });
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
  font-weight: bold;  
  margin-left: 20px;

}

.container-card{
  
padding: 20px;
  box-shadow: 0 2px 5px rgb(90, 87, 87);
  transition: 0.2s ease-in-out;

}


.cards-container {
  display: flex;
  gap: 20px;
  justify-content: left;
  margin-bottom: 40px;
  flex-wrap: wrap;
  margin-left: 130px;
  margin-top: 30px;
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
  transform: translateY(-7px);
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
