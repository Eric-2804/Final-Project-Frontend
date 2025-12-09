<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Matrículas</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.estudiante" :options="estudiantes" label="Estudiante" />
      <q-select filled v-model="form.acudiente.acudiente" :options="acudientes" label="Acudiente" />
      <q-input filled v-model="form.acudiente.parentesco" label="Parentesco" />
      <q-select filled v-model="form.grupo" :options="grupos" label="Grupo" />
      <q-input filled v-model="form.año" label="Año" type="number" />
      <q-input filled v-model="form.fechaMatricula" label="Fecha de Matrícula" type="date" />
      <q-input filled v-model="form.numeroMatricula" label="Número de Matrícula" />
      <q-select filled v-model="form.estado" :options="['ACTIVA', 'RETIRADA', 'DESERCIÓN', 'GRADUADA']" label="Estado" />
      <q-input filled v-model="form.observaciones" label="Observaciones" type="textarea" />
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createMatricula } from '@/services/matriculasService';
import { getAllColegios } from '@/services/colegiosService';
import { getAllUsers } from '@/services/usuariosColegioService';
import { getAllGrupos } from '@/services/gruposService';

const form = ref({
  estudiante: null,
  acudiente: {
    acudiente: null,
    parentesco: ''
  },
  grupo: null,
  año: null,
  fechaMatricula: '',
  numeroMatricula: '',
  estado: 'ACTIVA',
  observaciones: '',
  colegio: null
});

const estudiantes = ref([]);
const acudientes = ref([]);
const grupos = ref([]);
const colegios = ref([]);

onMounted(async () => {
  try {
    const colegiosRes = await getAllColegios();
    colegios.value = colegiosRes.data.map(c => ({ label: c.nombre, value: c._id }));

    const usersRes = await getAllUsers();
    estudiantes.value = usersRes.data.filter(u => u.rol === 'estudiante').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
    acudientes.value = usersRes.data.filter(u => u.rol === 'acudiente').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));

    const gruposRes = await getAllGrupos();
    grupos.value = gruposRes.data.map(g => ({ label: g.grupo, value: g._id }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const onSubmit = async () => {
  try {
    await createMatricula(form.value);
    console.log('Matricula created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating matricula:', error);
  }
};
</script>