<template>
    <div class="q-pa-md">
  
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Gestión de Profesores</div>
          <div class="text-caption text-grey">Listado de docentes registrados</div>
        </q-card-section>
      </q-card>
  
      <q-separator spaced />
  
      <TemplateTable
        :columns="columns"
        :rows="teachers"
        row-key="_id"
        enable-sorting
      >
        <!-- Columna personalizada para estado -->
        <template #body-isActive="{ row }">
          <q-badge :color="row.isActive ? 'green' : 'red'">
            {{ row.isActive ? 'Activo' : 'Inactivo' }}
          </q-badge>
        </template>
      </TemplateTable>
  
      <!-- Loader -->
      <div v-if="loading" class="flex flex-center q-mt-xl">
        <q-spinner-cube color="primary" size="60px" />
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import TemplateTable from "../components/tables.vue"; // tu tabla
  import { getUsersByRol } from "../services/apiteacher";  // servicio que ya tienes
  
  const loading = ref(true);
  const teachers = ref([]);
  
  const columns = [
    { name: "names", label: "Nombres", field: "names", align: "left", sortable: true },
    { name: "lastNames", label: "Apellidos", field: "lastNames", align: "left", sortable: true },
    { name: "email", label: "Correo", field: "email", align: "left" },
    { name: "numberDocument", label: "Documento", field: "numberDocument", align: "left" },
    { name: "cellphone", label: "Teléfono", field: "cellphone", align: "left" },
    { name: "isActive", label: "Estado", field: "isActive", align: "center" },
  ];
  
  async function loadTeachers() {
    try {
      loading.value = true;
  
      // 👇 OJO: AQUI AJUSTA EXACTAMENTE COMO SE LLAMA EL ROL EN TU BD
      const response = await getUsersByRol("profesor");
  
      teachers.value = response?.data || [];
  
    } catch (error) {
      console.error("Error cargando docentes", error);
    } finally {
      loading.value = false;
    }
  }
  
  onMounted(() => {
    loadTeachers();
  });
  </script>
  
  <style scoped>
  .my-card {
    border-radius: 12px;
    padding: 10px;
  }
  </style>
  