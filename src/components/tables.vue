<template>
  <div class="translator">
    <div class="block">
      <div class="top-controls">
        <!-- Input del buscador -->
        <q-input
          v-model="filter"
          label="buscar..."
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

        <!-- Boton del ultimo cambio -->
        <q-btn
          v-if="enableSorting"
          flat
          color="primary"
          icon="swap_vert"
          label="ordenar por último cambio"
          @click="toggleSortOrder"
          class="sort-btn"
        />
      </div>

      <!-- Tabla -->
      <q-table
        :rows="processedRows"
        :columns="columns"
        :filter="filter"
        :row-key="rowKey"
        color="primary"
        class="board"
      >
        <!-- Passthrough para todos los slots -->
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  columns: Array,
  rows: Array,
  rowKey: {
    type: String,
    default: 'id',
  },
  enableSorting: {
    type: Boolean,
    default: false,
  },
});

const filter = ref('');
const sortOrder = ref('desc');

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
}

const processedRows = computed(() => {
  if (props.enableSorting) {
    // Asegurarse de que las filas sean un array antes de ordenar
    const rowsArray = Array.isArray(props.rows) ? [...props.rows] : [];
    return rowsArray.sort((a, b) => {
      const dateA = new Date(a.lastChange);
      const dateB = new Date(b.lastChange);
      // Manejar fechas inválidas
      if (isNaN(dateA) || isNaN(dateB)) {
        return 0;
      }
      return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }
  return props.rows;
});
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