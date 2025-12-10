<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <div class="col"><q-input v-model="groupId" label="ID Grupo" dense /></div>
        <div class="col-auto"><q-input v-model.number="year" label="Año (opcional)" type="number" dense /></div>
        <div class="col-auto"><q-btn label="Buscar" color="primary" @click="fetch"/></div>
      </div>
    </q-card-section>
    <q-card-section>
      <qualification-table :rows="rows" :loading="loading" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
//import qualificationService from '@/services/qualificationService.js';
import QualificationTable from '@/components/qualifications/QualificationTable.vue';

const groupId = ref('');
const year = ref(null);
const rows = ref([]);
const loading = ref(false);

async function fetch() {
  if (!groupId.value) return;
  loading.value = true;
  try {
    const res = await qualificationService.listFinalsByGroup(groupId.value, year.value);
    rows.value = res.data || res;
  } catch (err) { console.error(err); }
  finally { loading.value = false; }
}
</script>