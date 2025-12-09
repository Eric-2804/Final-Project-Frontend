<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Indicadores</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-input filled v-model="form.año" label="Año" />
      <q-select filled v-model="form.grupo" :options="grupos" label="Grupo" />
      <q-select filled v-model="form.materia" :options="materias" label="Materia" />
      <q-select filled v-model="form.tipo" :options="tiposIndicador" label="Tipo" multiple />
      <q-input filled v-model="form.descripcion" label="Descripción" type="textarea" />
      <q-select filled v-model="form.periodo" :options="periodos" label="Período" />
      <q-input filled v-model="form.calificacion" label="Calificación" />
      <q-select filled v-model="form.usuarioQueLoHizo" :options="usuarios" label="Usuario" />
      <q-checkbox v-model="form.estado" label="Estado" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createIndicador } from '@/services/indicadoresService';
import { getAllColegios } from '@/services/colegiosService';
import { getAllGrupos } from '@/services/gruposService';
import { getAllMateriasAreas } from '@/services/materiaAreaService';
import { getAllPeriodos } from '@/services/periodosService';
import { getAllUsers } from '@/services/usuariosColegioService';

const form = ref({
  colegio: null,
  año: '',
  grupo: null,
  materia: null,
  tipo: [],
  descripcion: '',
  periodo: null,
  calificacion: '',
  usuarioQueLoHizo: null,
  estado: false
});

const colegios = ref([]);
const grupos = ref([]);
const materias = ref([]);
const tiposIndicador = ref([]); // This should be populated from a service if available
const periodos = ref([]);
const usuarios = ref([]);

onMounted(async () => {
  try {
    const [colegiosRes, gruposRes, materiasRes, periodosRes, usersRes] = await Promise.all([
      getAllColegios(),
      getAllGrupos(),
      getAllMateriasAreas(),
      getAllPeriodos(),
      getAllUsers(),
    ]);

    colegios.value = colegiosRes.data.map(c => ({ label: c.nombre, value: c._id }));
    grupos.value = gruposRes.data.map(g => ({ label: g.grupo, value: g._id }));
    materias.value = materiasRes.data.map(m => ({ label: m.nombre, value: m._id }));
    periodos.value = periodosRes.data.map(p => ({ label: p.nombre, value: p._id }));
    usuarios.value = usersRes.data.map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const onSubmit = async () => {
  try {
    await createIndicador(form.value);
    console.log('Indicador created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating indicador:', error);
  }
};
</script>