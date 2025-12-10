<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Generar calificaciones finales</div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="schoolId" label="ID Colegio (opcional)" dense />
      <q-input v-model.number="year" label="Año (obligatorio)" type="number" dense />
      <q-input v-model="groupId" label="ID Grupo (opcional)" dense />
      <div class="q-mt-sm">
        <q-btn label="Generar" color="primary" @click="generate" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
//import qualificationService from '@/services/qualificationService.js';
import { notifyPositive, notifyNegative } from '@/composables/useNotify.js';

const schoolId = ref('');
const year = ref(new Date().getFullYear());
const groupId = ref('');

async function generate() {
  if (!year.value) return notifyNegative('El año es obligatorio');
  try {
    const res = await qualificationService.generateFinals({ schoolId: schoolId.value || null, year: year.value, groupId: groupId.value || null });
    notifyPositive(res.data?.message || 'Generación finalizada');
  } catch (err) { notifyNegative(err.response?.data?.error || err.message); }
}
</script>