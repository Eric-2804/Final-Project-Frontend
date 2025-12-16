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
import { getQualificationsByStudent, updateQualification } from '../../services/qualificationsSecretary.js';
import { useNotify } from '../../composables/useNotify.js';
import QualificationTable from '@/components/qualifications/QualificationTable.vue';
import QualificationForm from '@/components/qualifications/QualificationForm.vue';

const { showNotify, showErrorNotify } = useNotify();
const studentId = ref('');
const year = ref(new Date().getFullYear());
const rows = ref([]);
const loading = ref(false);
const editDialog = ref(false);
const selected = ref({});

async function fetch() {
  if (!studentId.value) {
    showErrorNotify({ message: 'Por favor ingrese un ID de estudiante' });
    return;
  }
  loading.value = true;
  try {
    const res = await getQualificationsByStudent(studentId.value, year.value);
    console.log('Respuesta del servidor:', res);
    // El backend devuelve array directo, no objeto con propiedad qualifications
    rows.value = Array.isArray(res) ? res : (res.qualifications || res.data || []);
    if (rows.value.length === 0) {
      showNotify({ message: 'No se encontraron calificaciones para este estudiante' });
    } else {
      showNotify({ message: `Se encontraron ${rows.value.length} calificaciones` });
    }
  } catch (err) {
    console.error('Error al cargar calificaciones:', err);
    showErrorNotify({ message: 'Error al cargar calificaciones: ' + (err.response?.data?.msg || err.message) });
    rows.value = [];
  } finally { 
    loading.value = false; 
  }
}

function onEdit(row) {
  selected.value = { ...row };
  editDialog.value = true;
}

async function save(payload) {
  try {
    const res = await updateQualification(selected.value._id, payload);
    const idx = rows.value.findIndex(r => r._id === selected.value._id);
    if (idx !== -1) {
      rows.value[idx] = res.qualification || res.data || res;
    }
    editDialog.value = false;
    showNotify({ message: 'Calificación actualizada correctamente' });
  } catch (err) {
    showErrorNotify({ message: 'Error al actualizar: ' + (err.response?.data?.msg || err.message) });
  }
}
</script>