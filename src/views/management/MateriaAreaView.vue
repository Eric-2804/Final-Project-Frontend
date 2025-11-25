<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Materias y Áreas</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-input filled v-model="form.nombre" label="Nombre" />
      <q-input filled v-model="form.codigo" label="Código" />
      <q-checkbox v-model="form.esIndependiente" label="Calificación Independiente" />
      <q-checkbox v-model="form.incluyeEnEstadisticas" label="Incluir en Estadísticas" />
      <q-checkbox v-model="form.activa" label="Activa" />
      <q-select filled v-model="form.tipo" :options="['materia', 'area']" label="Tipo" />
      <q-input filled v-model="form.codigoArea" label="Código de Área" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createMateriaArea } from '@/services/materiaAreaService';
import { getAllColegios } from '@/services/colegiosService';

const form = ref({
  colegio: null,
  nombre: '',
  codigo: '',
  esIndependiente: false,
  incluyeEnEstadisticas: false,
  activa: false,
  tipo: 'materia',
  codigoArea: ''
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
    await createMateriaArea(form.value);
    console.log('Materia/Area created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating materia/area:', error);
  }
};
</script>