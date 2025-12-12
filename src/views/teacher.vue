<template>
  <div class="q-pa-lg">

    <div class="text-h4 text-bold q-mb-lg title">Gestión de Profesores</div>

    <!-- TARJETAS SUPERIORES -->
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import TableComponent from "../components/tables.vue"
import { getUsersByRol } from "../services/apiteacher"

const teachers = ref([])

const columns = [
  { name: "names", label: "Nombres", field: "names", align: "left" },
  { name: "lastNames", label: "Apellidos", field: "lastNames", align: "left" },
  { name: "email", label: "Correo", field: "email", align: "left" },
  { name: "roles", label: "Rol", field: "roles", align: "left" },
  { name: "isActive", label: "Estado", field: "isActive", align: "center" }
]

const activeTeachers = computed(() =>
  teachers.value.filter(t => t.isActive).length
)

const inactiveTeachers = computed(() =>
  teachers.value.filter(t => !t.isActive).length
)

const loadTeachers = async () => {
  const res = await getUsersByRol("profesor")
  teachers.value = res.users || res || []
}

onMounted(loadTeachers)
</script>

<style scoped>
.title{
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
  margin-left: 80px;
}


.stat-card {
  width: 300px;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 14px rgb(90, 87, 87);
  transition: 0.2s ease-in-out;
  margin-right: 60px;
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
