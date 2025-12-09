<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Períodos</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-input filled v-model="form.año" label="Año" type="number" />
      <q-select filled v-model="form.ciclo" :options="['normal', 'semestre 1', 'semestre 2']" label="Ciclo" />
      <q-input filled v-model="form.numero" label="Número" type="number" />
      <q-input filled v-model="form.nombre" label="Nombre" />
      <q-input filled v-model="form.fechaInicio" label="Fecha de Inicio" type="date" />
      <q-input filled v-model="form.fechaFin" label="Fecha de Fin" type="date" />
      <q-input filled v-model="form.porcentaje" label="Porcentaje" type="number" />
      <q-checkbox v-model="form.activo" label="Activo" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createPeriodo } from '../services/periodService';

const form = ref({
  colegio: null,
  año: null,
  ciclo: 'normal',
  numero: null,
  nombre: '',
  fechaInicio: '',
  fechaFin: '',
  porcentaje: null,
  activo: false
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
    await createPeriodo(form.value);
    console.log('Periodo created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating periodo:', error);
  }
};
</script>