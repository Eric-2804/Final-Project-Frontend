<template>
  <div class="q-pa-md">
    <h1 class="text-h5">Gestión de Usuarios del Colegio</h1>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input filled v-model="form.nombres" label="Nombres" />
      <q-input filled v-model="form.apellidos" label="Apellidos" />
      <q-select filled v-model="form.tipoDocumento" :options="['CC', 'TI', 'CE']" label="Tipo de Documento" />
      <q-input filled v-model="form.numeroDocumento" label="Número de Documento" />
      <q-input filled v-model="form.email" label="Email" type="email" />
      <q-input filled v-model="form.password" label="Contraseña" type="password" />
      <q-input filled v-model="form.telefono" label="Teléfono" />
      <q-input filled v-model="form.direccion" label="Dirección" />
      <q-input filled v-model="form.fechaNacimiento" label="Fecha de Nacimiento" type="date" />
      <q-select filled v-model="form.genero" :options="['Masculino', 'Femenino', 'Otro']" label="Género" />
      <q-checkbox v-model="form.activo" label="Activo" />
      <q-select filled v-model="form.rol" :options="['coordinador', 'rector', 'secretaria', 'estudiante', 'profesor', 'acudiente']" label="Rol" />
      <q-input filled v-model="form.estrato" label="Estrato" type="number" />
      <q-input filled v-model="form.sisben" label="Sisbén" />
      <q-input filled v-model="form.eps" label="EPS" />
      <q-input filled v-model="form.tipoSangre" label="Tipo de Sangre" />
      <q-checkbox v-model="form.poblacionVictima" label="Población Víctima" />
      <q-input filled v-model="form.discapacidad" label="Discapacidad" />
      <q-input filled v-model="form.etnia" label="Etnia" />
      <q-input filled v-model="form.fotoPerfil" label="Foto de Perfil" />
      <q-input filled v-model="form.firmaDigital" label="Firma Digital" />
      <q-select filled v-model="form.colegio" :options="colegios" label="Colegio" />
      <q-btn label="Guardar" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createUser } from '@/services/usuariosColegioService';
import { getAllColegios } from '@/services/colegiosService';

const form = ref({
  nombres: '',
  apellidos: '',
  tipoDocumento: 'CC',
  numeroDocumento: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: 'Masculino',
  activo: false,
  rol: 'estudiante',
  estrato: null,
  sisben: '',
  eps: '',
  tipoSangre: '',
  poblacionVictima: false,
  discapacidad: '',
  etnia: '',
  fotoPerfil: '',
  firmaDigital: '',
  colegio: null
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
    await createUser(form.value);
    console.log('User created successfully');
    // Optionally, reset form or show a success message
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
</script>