<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Registrar calificaciones en lote</div>
    </q-card-section>
    <q-card-section>
      <batch-form @submit="submitBatch" @error="onError" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import BatchForm from '@/components/qualifications/BatchForm.vue';
//import qualificationService from '@/services/qualificationService.js';
//import { notifyPositive, notifyNegative } from '@/composables/useNotify.js';

async function submitBatch(arr) {
  try {
    const res = await qualificationService.createBatch(arr);
    notifyPositive(res.data?.message || 'Lote creado');
  } catch (err) {
    notifyNegative(err.response?.data?.message || err.message);
  }
}
function onError(msg) { notifyNegative(msg); }
</script>