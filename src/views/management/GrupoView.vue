<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Grupos</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.sede" :options="sedes" label="Sede" />
      <q-input filled v-model="form.año" label="Año" type="number" />
      <q-select filled v-model="form.ciclo" :options="['normal', 'semestre 1', 'semestre 2']" label="Ciclo" />
      <q-select filled v-model="form.nivel" :options="['PREESCOLAR', 'BASICA_PRIMARIA', 'BASICA_SECUNDARIA', 'MEDIA']" label="Nivel" />
      <q-select filled v-model="form.grado" :options="grados" label="Grado" />
      <q-input filled v-model="form.grupo" label="Grupo" />
      <q-select filled v-model="form.jornada" :options="['MAÑANA', 'TARDE', 'NOCHE']" label="Jornada" />
      <q-select filled v-model="form.directorGrupo" :options="profesores" label="Director de Grupo" />
      <q-checkbox v-model="form.activo" label="Activo" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { createGrupo } from '@/services/gruposService';
import { getAllSedes } from '@/services/sedesService';
import { getAllUsers } from '@/services/usuariosColegioService';

const form = ref({
  sede: null,
  año: null,
  ciclo: 'normal',
  nivel: 'PREESCOLAR',
  grado: '',
  grupo: '',
  jornada: 'MAÑANA',
  directorGrupo: null,
  activo: false
});

const sedes = ref([]);
const profesores = ref([]);

onMounted(async () => {
  try {
    const sedesRes = await getAllSedes();
    sedes.value = sedesRes.data.map(s => ({ label: s.nombre, value: s._id }));

    const usersRes = await getAllUsers();
    profesores.value = usersRes.data.filter(u => u.rol === 'profesor').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const grados = computed(() => {
  switch (form.value.nivel) {
    case 'PREESCOLAR':
      return ['PREJARDIN', 'JARDIN', 'TRANSICION'];
    case 'BASICA_PRIMARIA':
      return ['1', '2', '3', '4', '5'];
    case 'BASICA_SECUNDARIA':
      return ['6', '7', '8', '9'];
    case 'MEDIA':
      return ['10', '11'];
    default:
      return [];
  }
});

const onSubmit = async () => {
  try {
    await createGrupo(form.value);
    console.log('Grupo created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating grupo:', error);
  }
};
</script>