<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Calificaciones</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.Colegio" :options="colegios" label="Colegio" />
      <q-select filled v-model="form.estudiante" :options="estudiantes" label="Estudiante" />
      <q-select filled v-model="form.materia" :options="materias" label="Materia" />
      <q-select filled v-model="form.grupo" :options="grupos" label="Grupo" />
      <q-select filled v-model="form.periodo" :options="periodos" label="Período" />
      <q-input filled v-model="form.año" label="Año" type="number" />
      <q-select filled v-model="form.tipoNota" :options="['PERIODO', 'FINAL']" label="Tipo de Nota" />
      <q-input filled v-model="form.nota" label="Nota" type="number" step="0.1" />
      <q-input filled v-model="form.juicioValorativo" label="Juicio Valorativo" />
      <q-input filled v-model="form.fallas" label="Fallas" type="number" />
      <q-input filled v-model="form.observaciones" label="Observaciones" type="textarea" />
      <q-select filled v-model="form.registradoPor" :options="profesores" label="Registrado Por" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { getAllPeriodos } from '../services/periodService';

const form = ref({
  Colegio: null,
  estudiante: null,
  materia: null,
  grupo: null,
  periodo: null,
  año: null,
  tipoNota: 'PERIODO',
  nota: null,
  juicioValorativo: '',
  fallas: null,
  observaciones: '',
  registradoPor: null,
});

const colegios = ref([]);
const estudiantes = ref([]);
const materias = ref([]);
const grupos = ref([]);
const periodos = ref([]);
const profesores = ref([]);

onMounted(async () => {
  try {
    const [colegiosRes, usersRes, materiasRes, gruposRes, periodosRes] = await Promise.all([
      getAllColegios(),
      getAllUsers(),
      getAllMateriasAreas(),
      getAllGrupos(),
      getAllPeriodos(),
    ]);

    colegios.value = colegiosRes.data.map(c => ({ label: c.nombre, value: c._id }));
    estudiantes.value = usersRes.data.filter(u => u.rol === 'estudiante').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
    profesores.value = usersRes.data.filter(u => u.rol === 'profesor').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
    materias.value = materiasRes.data.map(m => ({ label: m.nombre, value: m._id }));
    grupos.value = gruposRes.data.map(g => ({ label: g.grupo, value: g._id }));
    periodos.value = periodosRes.data.map(p => ({ label: p.nombre, value: p._id }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const onSubmit = async () => {
  try {
    await createCalificacion(form.value);
    // Optionally, reset form or show a success message
  } catch (error) {
  }
};
</script>