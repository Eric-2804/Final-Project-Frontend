<template>
  <div class="academic-container">
    <h1 class="title">Carga Académica</h1>

    <button class="btn-primary" @click="startCreate" style="background-color: #0053a6; color: #ffffff;">
      + Crear carga académica
    </button>

    <div v-if="mode === 'list'" class="list">
      <table>
        <thead>
          <tr>
            <th>Instructor</th>
            <th>Programa</th>
            <th>Asignatura</th>
            <th>Horas semanales</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in academicList" :key="item._id">
            <td>{{ item.instructor }}</td>
            <td>{{ item.program }}</td>
            <td>{{ item.subject }}</td>
            <td>{{ item.weeklyHours }}</td>
            <td>{{ item.year }}</td>

            <td class="actions">
              <button class="btn-small" @click="viewDetail(item._id)">
                Ver
              </button>
              <button class="btn-small" @click="editItem(item._id)">
                Editar
              </button>
              <button class="btn-delete" @click="deleteItem(item._id)">
                Eliminar
              </button>
            </td>
          </tr>

          <tr v-if="academicList.length === 0">
            <td colspan="6" class="empty">No hay registros disponibles</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mode === 'form'" class="form">
      <div class="form-container">
        <h2>{{ editingId ? "Editar carga" : "Crear carga" }}</h2>

        <form @submit.prevent="save">
          <label>Instructor</label>
          <input v-model="form.instructor" placeholder="Nombre del instructor" required />

          <label>Programa</label>
          <input v-model="form.program" placeholder="Programa académico" required />

          <label>Asignatura</label>
          <input v-model="form.subject" placeholder="Nombre de la asignatura" required />

          <label>Horas semanales</label>
          <input type="number" v-model="form.weeklyHours" placeholder="Horas por semana" required />

          <label>Año</label>
          <input type="number" v-model="form.year" placeholder="Año académico" required />

          <div class="form-buttons">
            <button class="btn-primary" type="submit">Guardar</button>
            <button class="btn-secondary" @click="cancelForm" type="button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="mode === 'detail'" class="detail">
      <h2>Detalle</h2>

      <div class="detail-item"><strong>Instructor:</strong> {{ detail.instructor }}</div>
      <div class="detail-item"><strong>Programa:</strong> {{ detail.program }}</div>
      <div class="detail-item"><strong>Asignatura:</strong> {{ detail.subject }}</div>
      <div class="detail-item"><strong>Horas semanales:</strong> {{ detail.weeklyHours }}</div>
      <div class="detail-item"><strong>Año:</strong> {{ detail.year }}</div>

      <button class="btn-secondary" @click="backToList">Volver</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import academicLoadService from "../../services/guardianServices/academicLoadService.js";

const mode = ref("list");

const academicList = ref([]);

const editingId = ref(null);
const form = ref({
  instructor: "",
  program: "",
  subject: "",
  weeklyHours: "",
  year: "",
});

const detail = ref({});

const loadList = async () => {
  try {
    const response = await academicLoadService.getAll();
    academicList.value = response.data;
  } catch (error) {
    console.error("Error al cargar la lista:", error);
    academicList.value = [];
  }
};

onMounted(loadList);

const startCreate = () => {
  editingId.value = null;
  form.value = {
    instructor: "",
    program: "",
    subject: "",
    weeklyHours: "",
    year: "",
  };
  mode.value = "form";
};

const save = async () => {
  try {
    if (editingId.value) {
      await academicLoadService.update(editingId.value, form.value);
    } else {
      await academicLoadService.create(form.value);
    }
    await loadList();
    mode.value = "list";
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};

const editItem = async (id) => {
  try {
    editingId.value = id;
    const response = await academicLoadService.getById(id);
    form.value = { ...response.data };
    mode.value = "form";
  } catch (error) {
    console.error("Error al cargar el registro:", error);
  }
};

const deleteItem = async (id) => {
  if (confirm("¿Eliminar este registro?")) {
    try {
      await academicLoadService.delete(id);
      await loadList();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }
};

const viewDetail = async (id) => {
  try {
    const response = await academicLoadService.getById(id);
    detail.value = response.data;
    mode.value = "detail";
  } catch (error) {
    console.error("Error al obtener detalle:", error);
  }
};

const cancelForm = () => {
  mode.value = "list";
};

const backToList = () => {
  mode.value = "list";
};
</script>

<style scoped>
:root {
  --primary: #0053a6;
  --primary-light: #3e7bd6;
  --danger: #d93131;
  --text-dark: #2a2a2a;
  --gray-light: #f0f0f0;
  --white: #ffffff;
}

.academic-container {
  padding: 25px;
  background: var(--white);
  min-height: 80vh;
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--primary);
}

.btn-primary {
  background: var(--primary) !important;
  color: var(--white) !important;
  border: none;
  padding: 10px 14px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}

.btn-primary:hover {
  background: var(--primary-light);
}

.btn-secondary {
  background: var(--gray-light);
  border: none;
  padding: 10px 14px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.btn-small {
  padding: 5px 10px;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.btn-delete {
  padding: 5px 10px;
  background: var(--danger);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
}

th {
  background: var(--primary);
  color: var(--white);
  padding: 10px;
  text-align: left;
}

td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  gap: 5px;
}

.empty {
  text-align: center;
  color: #888;
  padding: 15px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-buttons {
  margin-top: 10px;
  display: flex;
}

.detail-item {
  margin-bottom: 10px;
}

/* Nuevo estilo para el formulario centrado */
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.form-container {
  background: #f9f9f9;
  padding: 25px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}
</style>