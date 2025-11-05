<template>
  <div class="translator">
    <div class="block">
      <div class="top-controls">
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

        <q-btn
          flat
          color="primary"
          icon="swap_vert"
          label="ordenar por último cambio"
          @click="toggleSortOrder"
          class="sort-btn"
        />
      </div>

      <q-table
        :rows="sortedRows"
        :columns="columns"
        :filter="filter"
        row-key="id"
        color="primary"
        class="board"
      >
        <!-- acciones -->
        <template v-if="actions" v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              size="sm"
              color="primary"
              icon="edit"
              round
              dense
              class="q-mr-sm"
              @click="$emit('edit', props.row)"
            />
            <q-btn
              size="sm"
              :color="props.row.active ? 'negative' : 'positive'"
              :icon="props.row.active ? 'close' : 'check'"
              round
              dense
              @click="$emit('toggleState', props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: Array,
  rows: Array,
  actions: Boolean
})

const filter = ref('')
const sortOrder = ref('desc') 

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const sortedRows = computed(() => {
  return [...props.rows].sort((a, b) => {
    const dateA = new Date(a.lastChange)
    const dateB = new Date(b.lastChange)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
})
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
