<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Parámetros</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-input filled v-model="form.escudo" label="Escudo" />
      <q-input filled v-model="form.certificadoencabezado" label="Encabezado de Certificado" />
      <q-input filled v-model="form.carnetfrente" label="Frente del Carnet" />
      <q-input filled v-model="form.carneatras" label="Atrás del Carnet" />
      <q-checkbox v-model="form.fotoestudiante" label="Incluir Foto del Estudiante" />
      <q-checkbox v-model="form.ligadoperiodo" label="Ligado a Período" />
      <q-checkbox v-model="form.ligadocalificacion" label="Ligado a Calificación" />
      <q-checkbox v-model="form.aproximarpromedio" label="Aproximar Promedio" />
      <q-checkbox v-model="form.estado" label="Estado" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createParametro } from '@/services/parametrosService';
import { getAllColegios } from '@/services/colegiosService';

const form = ref({
  colegio: null,
  escudo: '',
  certificadoencabezado: '',
  carnetfrente: '',
  carneatras: '',
  fotoestudiante: false,
  ligadoperiodo: false,
  ligadocalificacion: false,
  aproximarpromedio: false,
  estado: false
});

const colegios = ref([]);

onMounted(async () => {
  try {
    const res = await getAllColegios();
    colegios.value = res.data.map(c => ({ label: c.nombre, value: c._id }));
  } catch (error) {
    console.error('Error fetching colegios:', error);
  }
});

const onSubmit = async () => {
  try {
    await createParametro(form.value);
    console.log('Parametro created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating parametro:', error);
  }
};
</script>