<template>
  <div class="q-pa-lg">
    <h4>🔹 Prueba de Modales Reutilizables con Tabla</h4>

    <!-- Botón para crear -->
    <div class="q-gutter-md q-mt-lg">
      <ActionModal
        buttonLabel="Crear Sede"
        modalTitle="Crear sede"
        @saved="handleCreate"
      />
    </div>

    <!-- Tabla -->
    <div class="translator q-mt-xl">
      <div class="block">
        <div class="top-controls">
          <q-input
            v-model="filter"
            label="Buscar sede..."
            dense
            clearable
            rounded
            class="seeker"
            :debounce="200"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            flat
            color="primary"
            icon="swap_vert"
            label="Ordenar por último cambio"
            @click="toggleSortOrder"
            class="sort-btn"
          />
        </div>

        <q-table
          :rows="sortedRows"
          :columns="columns"
          :filter="filter"
          row-key="codigo"
          color="primary"
          class="board"
        >
          <!-- Botones de acción -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn
                size="sm"
                color="primary"
                icon="edit"
                round
                dense
                class="q-mr-sm"
                @click="handleEdit(props.row)"
              />
              <q-btn
                size="sm"
                :color="props.row.activa ? 'negative' : 'positive'"
                :icon="props.row.activa ? 'close' : 'check'"
                round
                dense
                @click="toggleState(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Modal oculto para editar -->
    <ActionModal
      v-if="selectedSede"
      ref="editModalRef"
      :showButton="false"
      modalTitle="Editar datos de la sede"
      :initial-data="selectedSede"
      @saved="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ActionModal from "@/components/ActionModal.vue";

const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
  { name: "codigo", label: "Código", field: "codigo", align: "center" },
  { name: "direccion", label: "Dirección", field: "direccion", align: "left" },
  { name: "telefono", label: "Teléfono", field: "telefono", align: "center" },
  { name: "coordinador", label: "Coordinador", field: "coordinador", align: "left" },
  { name: "actions", label: "Acciones", align: "center" },
];

const sedes = ref([
  {
    nombre: "Sede Central",
    codigo: "SC001",
    direccion: "Calle Principal #123",
    telefono: "123-456-7890",
    coordinador: "Juan Pérez",
    activa: true,
    lastChange: "2025-11-04T16:45:00",
  },
]);

const filter = ref("");
const sortOrder = ref("desc");

const selectedSede = ref(null);
const editModalRef = ref(null);

/* Ordenar tabla */
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
}
const sortedRows = computed(() => {
  return [...sedes.value].sort((a, b) => {
    const dateA = new Date(a.lastChange);
    const dateB = new Date(b.lastChange);
    return sortOrder.value === "desc" ? dateB - dateA : dateA - dateB;
  });
});

/* Crear */
function handleCreate(newSede) {
  newSede.codigo = "S" + Math.floor(Math.random() * 10000);
  newSede.lastChange = new Date().toISOString();
  sedes.value.push(newSede);
}

/* Editar */
function handleEdit(sede) {
  selectedSede.value = { ...sede };
  editModalRef.value?.openModal();
}

/* Guardar cambios */
function handleUpdate(updated) {
  const index = sedes.value.findIndex((s) => s.codigo === updated.codigo);
  if (index !== -1) {
    updated.lastChange = new Date().toISOString();
    sedes.value[index] = updated;
  }
  selectedSede.value = null;
}

/* Activar/Desactivar */
function toggleState(sede) {
  sede.activa = !sede.activa;
  sede.lastChange = new Date().toISOString();
}
</script>

<style scoped>
.translator {
  display: flex;
  justify-content: center;
}
.block {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 1200px;
}
.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.seeker {
  width: 250px;
  background-color: #efefef;
  border: #808080;
  padding: 10px;
}
.sort-btn {
  text-transform: none;
}
.board {
  background: #fff;
}
</style>
