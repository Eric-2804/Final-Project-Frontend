<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Registrar calificación individual</div>
    </q-card-section>
    <q-card-section>
      <qualification-form @save="create" @cancel="goBack" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
//import qualificationService from '@/services/qualificationService.js';
import QualificationForm from '@/components/qualifications/QualificationForm.vue';
//import { notifyPositive, notifyNegative } from '@/composables/useNotify.js';

const router = useRouter();
function goBack() { router.back(); }

async function create(payload) {
  try {
    await qualificationService.create(payload);
    notifyPositive('Calificación creada');
    router.push('/qualifications/student');
  } catch (err) {
    notifyNegative(err.response?.data?.message || err.message);
  }
}
</script>