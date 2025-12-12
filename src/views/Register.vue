<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2" style="width: 600px">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold">Registro</div>
        <div class="text-grey-8">Crea una nueva cuenta</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.names" label="Nombres" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.lastNames" label="Apellidos" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-select v-model="formData.typeDocument" :options="['CC', 'TI', 'CE']" label="Tipo de Documento" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.numberDocument" label="Número de Documento" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.email" label="Correo Electrónico" type="email" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.password" label="Contraseña" type="password" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.cellphone" label="Celular" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.direction" label="Dirección" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.dateBorn" label="Fecha de Nacimiento" type="date" outlined dense stack-label />
            </div>
            <div class="col-12 col-sm-6">
              <q-select v-model="formData.gender" :options="['Masculino', 'Femenino', 'Otro']" label="Género" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-select v-model="formData.roles" :options="['secretaria', 'rector', 'docente']" label="Rol" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.stratum" label="Estrato" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.sisben" label="Sisben" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.eps" label="EPS" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.typeBlood" label="Tipo de Sangre" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.disability" label="Discapacidad" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="formData.ethnic" label="Etnia" outlined dense />
            </div>
             <div class="col-12">
              <q-toggle v-model="formData.victimPopulation" label="Población Víctima" />
            </div>
            <div class="col-12">
              <q-input v-model="formData.profilePhoto" label="URL Foto de Perfil" outlined dense />
            </div>
            <div class="col-12">
              <q-input v-model="formData.signDigital" label="URL Firma Digital" outlined dense />
            </div>
            <div class="col-12">
              <q-input v-model="formData.college" label="ID Colegio" outlined dense />
            </div>
          </div>

          <q-btn
            label="Registrar"
            color="primary"
            type="submit"
            class="full-width q-mt-md"
            :loading="loading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          ¿Ya tienes una cuenta?
          <router-link to="/" class="text-primary text-weight-bold" style="text-decoration: none">Inicia sesión</router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const formData = ref({
  names: '',
  lastNames: '',
  typeDocument: 'CC',
  numberDocument: '',
  email: '',
  password: '',
  cellphone: '',
  direction: '',
  dateBorn: '',
  gender: 'Femenino',
  roles: 'secretaria',
  stratum: '',
  sisben: '',
  eps: '',
  typeBlood: '',
  victimPopulation: false,
  disability: '',
  ethnic: '',
  profilePhoto: '',
  signDigital: '',
  college: '',
});

const loading = ref(false);

const handleRegister = () => {
  loading.value = true;

  // Simular una llamada a la API
  setTimeout(() => {
    loading.value = false;
    console.log('Form data submitted:', formData.value);
    $q.notify({
      color: 'positive',
      message: '¡Registro exitoso! Ahora puedes iniciar sesión.',
      icon: 'check',
    });
    router.push('/');
  }, 1500);
};
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}
</style>