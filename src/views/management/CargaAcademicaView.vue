<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Carga Académica</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-select filled v-model="form.profesor" :options="profesores" label="Profesor" />
      <q-select filled v-model="form.materia" :options="materias" label="Materia" />
      <q-select filled v-model="form.grupo" :options="grupos" label="Grupo" />
      <q-input filled v-model="form.año" label="Año" type="number" />
      <q-input filled v-model="form.intensidadHoraria" label="Intensidad Horaria" />
      <q-input filled v-model="form.porcentaje" label="Porcentaje" type="number" />
      <q-checkbox v-model="form.activa" label="Activa" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createCargaAcademica } from '@/services/cargaAcademicaService';
import { getAllColegios } from '@/services/colegiosService';
import { getAllUsers } from '@/services/usuariosColegioService';
import { getAllMateriasAreas } from '@/services/materiaAreaService';
import { getAllGrupos } from '@/services/gruposService';

const form = ref({
  colegio: null,
  profesor: null,
  materia: null,
  grupo: null,
  año: null,
  intensidadHoraria: '',
  porcentaje: null,
  activa: false
});

const colegios = ref([]);
const profesores = ref([]);
const materias = ref([]);
const grupos = ref([]);

onMounted(async () => {
  try {
    const [colegiosRes, usersRes, materiasRes, gruposRes] = await Promise.all([
      getAllColegios(),
      getAllUsers(),
      getAllMateriasAreas(),
      getAllGrupos(),
    ]);

    colegios.value = colegiosRes.data.map(c => ({ label: c.nombre, value: c._id }));
    profesores.value = usersRes.data.filter(u => u.rol === 'profesor').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
    materias.value = materiasRes.data.map(m => ({ label: m.nombre, value: m._id }));
    grupos.value = gruposRes.data.map(g => ({ label: g.grupo, value: g._id }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const onSubmit = async () => {
  try {
    await createCargaAcademica(form.value);
    console.log('Carga Academica created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating Carga Academica:', error);
  }
};
</script>