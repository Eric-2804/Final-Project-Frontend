<template>
    <div class="q-pa-lg">
  
      <div class="text-h4 text-bold q-mb-md">Gestión de Profesores</div>
  
      <div class="row q-col-gutter-md q-mb-xl">
  
        <!-- Total -->
        <q-card class="col-12 col-md-4 stat-card gradient-blue">
          <q-card-section class="text-white">
            <div class="text-subtitle1">Total Profesores</div>
            <div class="text-h4 text-bold">{{ teachers.length }}</div>
          </q-card-section>
        </q-card>
  
        <!-- Activos -->
        <q-card class="col-12 col-md-4 stat-card gradient-green">
          <q-card-section class="text-white">
            <div class="text-subtitle1">Activos</div>
            <div class="text-h4 text-bold">{{ activeTeachers }}</div>
          </q-card-section>
        </q-card>
  
        <!-- Inactivos -->
        <q-card class="col-12 col-md-4 stat-card gradient-red">
          <q-card-section class="text-white">
            <div class="text-subtitle1">Inactivos</div>
            <div class="text-h4 text-bold">{{ inactiveTeachers }}</div>
          </q-card-section>
        </q-card>
  
      </div>
  
      <!-- Título y botón -->
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h5 text-bold">Listado de Profesores</div>
  
        <q-btn color="primary" icon="add" label="Nuevo Profesor" @click="openCreate" />
      </div>
  
      <!-- TABLA -->
      <TableComponent
        :columns="columns"
        :rows="teachers"
        row-key="_id"
        enable-sorting
      >
  
        <!-- Estado -->
        <template #body-cell-isActive="{ row }">
          <q-chip
            dense
            :color="row.isActive ? 'positive' : 'negative'"
            text-color="white"
          >
            {{ row.isActive ? "Activo" : "Inactivo" }}
          </q-chip>
        </template>
  
        <!-- Acciones -->
        <template #body-cell-actions="{ row }">
          <q-btn dense flat round color="primary" icon="edit" @click="openEdit(row)" />
  
          <q-btn dense flat round
            :color="row.isActive ? 'negative' : 'positive'"
            :icon="row.isActive ? 'toggle_off' : 'toggle_on'"
            @click="toggleState(row)"
          />
        </template>
  
      </TableComponent>
  
      <!-- MODAL -->
      <q-dialog v-model="dialogOpen">
        <FormComponent
          :title="isEditing ? 'Editar Profesor' : 'Nuevo Profesor'"
          subtitle="Complete los datos"
          @submit="saveTeacher"
          @cancel="dialogOpen = false"
          :model-value="form"
        >
  
          <template #fields="{ form }">
            <q-input v-model="form.names" label="Nombres" outlined dense />
            <q-input v-model="form.lastNames" label="Apellidos" outlined dense />
            <q-input v-model="form.email" label="Correo" outlined dense />
  
            <q-input
              v-if="!isEditing"
              v-model="form.password"
              label="Contraseña"
              type="password"
              outlined dense
            />
  
            <q-select
              v-model="form.roles"
              label="Rol"
              :options="['profesor']"
              outlined dense
            />
          </template>
  
        </FormComponent>
      </q-dialog>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import TableComponent from "../components/tables.vue";
  import FormComponent from "../components/BaseForm.vue";
  
  import {
    getUsersByRol,
    updateUser,
    activateUser,
    desactivateUser
  } from "../services/apiteacher";
  
  /* ==========================
     VARIABLES
  ===========================*/
  const teachers = ref([]);
  const dialogOpen = ref(false);
  const isEditing = ref(false);
  
  const form = ref({
    names: "",
    lastNames: "",
    email: "",
    password: "",
    roles: ["profesor"],
  });
  
  /* ==========================
     COLUMNAS
  ===========================*/
  const columns = [
    { name: "names", label: "Nombres", field: "names", align: "left" },
    { name: "lastNames", label: "Apellidos", field: "lastNames", align: "left" },
    { name: "email", label: "Correo", field: "email", align: "left" },
    { name: "roles", label: "Rol", field: "roles", align: "left" },
    { name: "isActive", label: "Estado", field: "isActive", align: "center" },
    { name: "actions", label: "Acciones", align: "center" }
  ];
  
  /* ==========================
     ESTADÍSTICAS
  ===========================*/
  const activeTeachers = computed(() =>
    teachers.value.filter(t => t.isActive).length
  );
  
  const inactiveTeachers = computed(() =>
    teachers.value.filter(t => !t.isActive).length
  );
  
  /* ==========================
     CARGAR
  ===========================*/
  const loadTeachers = async () => {
    const res = await getUsersByRol("profesor");
    teachers.value = res.users || res || [];
  };
  
  /* ==========================
     CREAR / EDITAR
  ===========================*/
  const openCreate = () => {
    isEditing.value = false;
    form.value = {
      names: "",
      lastNames: "",
      email: "",
      password: "",
      roles: ["profesor"]
    };
    dialogOpen.value = true;
  };
  
  const openEdit = (row) => {
    isEditing.value = true;
  
    form.value = {
      _id: row._id,
      names: row.names,
      lastNames: row.lastNames,
      email: row.email,
      roles: row.roles,
      password: ""
    };
  
    dialogOpen.value = true;
  };
  
  /* ==========================
     GUARDAR
  ===========================*/
  const saveTeacher = async () => {
    if (isEditing.value) {
      await updateUser(form.value._id, form.value);
    } else {
      console.warn("Falta endpoint POST para crear profesores");
    }
  
    await loadTeachers();
    dialogOpen.value = false;
  };
  
  /* ==========================
     ACTIVAR/DESACTIVAR
  ===========================*/
  const toggleState = async (row) => {
    if (row.isActive) {
      await desactivateUser(row._id);
      row.isActive = false;
    } else {
      await activateUser(row._id);
      row.isActive = true;
    }
  };
  
  onMounted(loadTeachers);
  </script>
  
  <style scoped>
  .stat-card {
    border-radius: 14px;
    min-height: 130px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  }
  
  .gradient-blue {
    background: linear-gradient(135deg, #2b62ff, #6c9eff);
  }
  .gradient-green {
    background: linear-gradient(135deg, #1faa00, #82d27c);
  }
  .gradient-red {
    background: linear-gradient(135deg, #ff3c2b, #ff8e80);
  }
  </style>
  