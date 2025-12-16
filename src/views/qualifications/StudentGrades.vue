<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <div class="col">
            <q-input v-model="studentId" label="ID Estudiante" dense />
          </div>
          <div class="col-auto">
            <q-input v-model.number="year" label="Año (opcional)" type="number" dense />
          </div>
          <div class="col-auto">
            <q-btn label="Buscar" @click="fetch" color="primary" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <qualification-table :rows="rows" :loading="loading" @edit="onEdit" />
      </q-card-section>
    </q-card>

    <q-dialog v-model="editDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar calificación</div>
        </q-card-section>
        <q-card-section>
          <qualification-form :model="selected" @save="save" @cancel="editDialog=false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
//import qualificationService from '@/services/qualificationsService.js';
import QualificationTable from '@/components/qualifications/QualificationTable.vue';
import QualificationForm from '@/components/qualifications/QualificationForm.vue';

const studentId = ref('');
const year = ref(null);
const rows = ref([]);
const loading = ref(false);
const editDialog = ref(false);
const selected = ref({});

async function fetch() {
  if (!studentId.value) return;
  loading.value = true;
  try {
    const res = await qualificationsService.listByStudent(studentId.value, year.value);
    rows.value = res.data || res; // según tu httpService
  } catch (err) {
  } finally { loading.value = false; }
}

function onEdit(row) {
  selected.value = { ...row };
  editDialog.value = true;
}

async function save(payload) {
  try {
    const res = await qualificationsService.update(selected.value._id, payload);
    const idx = rows.value.findIndex(r => r._id === res.data._id || r._id === res._id);
    rows.value[idx] = res.data || res;
    editDialog.value = false;
  } catch (err) { }
}
</script>