<template>
    <div class="q-pa-md">
  
      <h2 class="text-h5 q-mb-md">Listado de Profesores</h2>
  
      <div v-if="loading" class="flex flex-center">
        <q-spinner-cube color="primary" size="4em" />
      </div>
  
      <div v-else>
        <q-table
          :rows="teachers"
          :columns="columns"
          row-key="_id"
          flat
          bordered
        />
      </div>
  
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { getUsersByRol } from "@/services/apiteacher";
  
  export default {
    setup() {
      const teachers = ref([]);
      const loading = ref(true);
  
      const columns = [
        { name: "nombre", label: "Nombre", field: "lastNames", align: "left" },
        { name: "email", label: "Correo", field: "email", align: "left" },
        { name: "rol", label: "Rol", field: "roles", align: "left" },
        { name: "estado", label: "Estado", field: "estado", align: "left" }
      ];
  
      const loadTeachers = async () => {
        try {
          loading.value = true;
  
          const resp = await getUsersByRol("profesor");
          console.log("DOCENTES:", resp);
  
          teachers.value = resp.users || resp || [];
        } catch (error) {
          console.error("Error cargando docentes", error);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(loadTeachers);
  
      return { teachers, loading, columns };
    },
  };
  </script>
  