<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Vigencias</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input filled v-model="form.año" label="Año" type="number" />
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-checkbox v-model="form.activa" label="Activa" />
      <q-select filled v-model="form.rector" :options="rectores" label="Rector" />
      <q-select filled v-model="form.secretariaGeneral" :options="secretarias" label="Secretaria General" />

      <h2 class="text-h6">Información de Sedes</h2>
      <div v-for="(sede, index) in form.Infosedes" :key="index" class="q-mb-md">
        <q-select filled v-model="sede.Sede" :options="sedes" label="Sede" />
        <q-select filled v-model="sede.coordinador" :options="coordinadores" label="Coordinador" />
        <q-select filled v-model="sede.secretaria" :options="secretarias" label="Secretaria" />
      </div>
      <q-btn @click="addSede" label="Añadir Sede" color="primary" />

      <q-input filled v-model="form.Notamaxima" label="Nota Máxima" type="number" step="0.1" />
      <q-input filled v-model="form.Notaminima" label="Nota Mínima" type="number" step="0.1" />

      <h2 class="text-h6">Convenciones de Nota</h2>
      <div v-for="(convencion, index) in form.Convencionesnota" :key="index" class="q-mb-md">
        <q-input filled v-model="convencion.codigo" label="Código (e.g., alto, básico)" />
        <q-input filled v-model="convencion.valor" label="Valor (e.g., A, B, 4.5)" />
        <q-input filled v-model="convencion.orden" label="Orden" />
      </div>
      <q-btn @click="addConvencion" label="Añadir Convención" color="primary" />

      <q-input filled v-model="form.Pierdeano" label="Condición para perder el año" />
      <q-select filled v-model="form.Notahabilitaciones" :options="['1', '2']" label="Nota de Habilitaciones" />
      <q-input v-if="form.Notahabilitaciones === '1'" filled v-model="form.PorcentajeNH" label="Porcentaje NH" type="number" />
      <q-input filled v-model="form.Numperdidas" label="Número máximo de áreas/materias perdidas para habilitar" type="number" />
      <q-input filled v-model="form.Actarecuperacion" label="Acta de Recuperación" />

      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createVigencia, getAllVigencias } from '@/services/vigenciasService';
import { getAllColegios } from '@/services/colegiosService';
import { getAllSedes } from '@/services/sedesService';
import { getAllUsers } from '@/services/usuariosColegioService';


const form = ref({
  año: null,
  colegio: null,
  activa: false,
  rector: null,
  secretariaGeneral: null,
  Infosedes: [],
  Notamaxima: null,
  Notaminima: null,
  Convencionesnota: [],
  Pierdeano: '',
  Notahabilitaciones: '1',
  PorcentajeNH: null,
  Numperdidas: null,
  Actarecuperacion: ''
});

const colegios = ref([]);
const rectores = ref([]); // This will be populated from users
const secretarias = ref([]); // This will be populated from users
const sedes = ref([]);
const coordinadores = ref([]); // This will be populated from users
const vigencias = ref([]);

onMounted(async () => {
  try {
    const colegiosRes = await getAllColegios();
    colegios.value = colegiosRes.data.map(c => ({ label: c.nombre, value: c._id }));

    const sedesRes = await getAllSedes();
    sedes.value = sedesRes.data.map(s => ({ label: s.nombre, value: s._id }));

    const vigenciasRes = await getAllVigencias();
    vigencias.value = vigenciasRes.data.map(v => ({ label: v.año, value: v._id }));

    const usersRes = await getAllUsers();
    rectores.value = usersRes.data.filter(u => u.rol === 'rector').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
    secretarias.value = usersRes.data.filter(u => u.rol === 'secretaria').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
    coordinadores.value = usersRes.data.filter(u => u.rol === 'coordinador').map(u => ({ label: `${u.nombres} ${u.apellidos}`, value: u._id }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const addSede = () => {
  form.value.Infosedes.push({ Sede: null, coordinador: null, secretaria: null });
};

const addConvencion = () => {
  form.value.Convencionesnota.push({ codigo: '', valor: '', orden: '' });
};

const onSubmit = async () => {
  try {
    await createVigencia(form.value);
    console.log('Vigencia created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating vigencia:', error);
  }
};
</script>