<template>
  <div class="translator">
    <div class="block">
      <q-input
        v-model="filter"
        label="Search..."
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

      <q-table
        :rows="rows"
        :columns="columns"
        :filter="filter"
        color="primary"
        class="board"
      >
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
              color="negative"
              icon="delete"
              round
              dense
              @click="$emit('delete', props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  columns: Array,
  rows: Array,
  actions: Boolean,
});

const filter = ref("");
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

.seeker {
  width: 250px;
  margin-bottom: 15px;
  background-color: #EFEFEF;
  border: #808080;
  padding: 10px;
}

.board {
  background: #fff;
}
</style>
