<template>
  <q-page class="q-pa-md bg-grey-2">
    <h3 class="q-mb-md text-h5 text-weight-bold">Mi Perfil</h3>

    <div class="row q-col-gutter-lg">
      <div class="col-xs-12 col-md-8">
        <q-card flat class="my-card">
          <q-card-section>
            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-sm-6">
                <q-card flat bordered class="q-pa-md text-center">
                  <q-avatar size="100px" class="q-mb-md">
                    <img :src="estudiante?.fotoUrl || 'https://cdn.quasar.dev/img/avatar.png'">
                  </q-avatar>
                  <div class="text-h6">{{ estudiante.nombres }} {{ estudiante.apellidos }}</div>
                </q-card>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Cambiar contraseña</div>
                  <div class="text-caption text-grey q-mb-sm">Actualice su contraseña</div>

                  <q-form @submit.prevent="handleChangePassword">
                    <q-input
                      filled
                      dense
                      v-model="passwordForm.currentPassword"
                      type="password"
                      label="Contraseña"
                      class="q-mb-sm"
                      required
                      autocomplete="current-password"
                    />

                    <q-input
                      filled
                      dense
                      v-model="passwordForm.newPassword"
                      type="password"
                      label="Nueva Contraseña"
                      class="q-mb-sm"
                      required
                      autocomplete="new-password"
                    />

                    <q-input
                      filled
                      dense
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      label="Confirmar Nueva Contraseña"
                      class="q-mb-md"
                      required
                      autocomplete="new-password"
                    />

                    <div class="row justify-end q-gutter-sm">
                      <q-btn flat label="Cancelar" color="grey" @click="resetPasswordForm" />
                      <q-btn type="submit" label="Guardar Cambios" color="primary" :loading="loading" />
                    </div>
                  </q-form>
                </q-card>
              </div>

              <div class="col-xs-12">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Información Personal</div>
                  
                  <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                    <div class="col-xs-12 col-sm-6">
                      <div class="text-caption text-grey">Email:</div>
                      <div class="text-body1 text-weight-medium">{{ estudiante.email }}</div>
                    </div>
                    
                    <div class="col-xs-12 col-sm-6">
                      <div class="text-caption text-grey">Rol:</div>
                      <div class="text-body1 text-weight-medium">{{ estudiante.rol }}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6">
                      <div class="text-caption text-grey">Núcleo:</div>
                      <div class="text-body1 text-weight-medium">{{ estudiante.nucleoEducativo }}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6">
                      <div class="text-caption text-grey">Tipo Documento:</div>
                      <div class="text-body1 text-weight-medium">{{ estudiante.tipoDocumento }}</div>
                    </div>
                    <div class="col-xs-12 col-sm-6">
                      <div class="text-caption text-grey">Número Documento:</div>
                      <div class="text-body1 text-weight-medium">{{ estudiante.numeroDocumento }}</div>
                    </div>
                  </div>
                  </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-md-4">
        </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// Importa tus stores y composables
// import { useAuthStore } from '../../store/authStore';
// import { useNotify } from '../../composables/useNotify';
// import api from '../../services/api';

// const auth = useAuthStore();
// const { showNotify } = useNotify();
const showNotify = (message, type) => console.log(`Notificación: ${message} (${type})`); // Simulación

const estudiante = ref({
  nombres: "Nombre", // Simula el "Nombre"
  apellidos: "Apellido", // Simula el "Apellido"
  rol: "Estudiante",
  email: "usuario@gmail.com",
  nucleoEducativo: "Núcleo educativo central", // Simula el "Núcleo"
  fotoUrl: 'https://i.imgur.com/rN1f6zO.png', // URL de ejemplo para el avatar
  // Datos completos de tu script original:
  tipoDocumento: "CC",
  numeroDocumento: "123456789",
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const loading = ref(false);

// 🔹 Usa datos de prueba para probar la vista
onMounted(() => {
  // En una aplicación real, harías una llamada al backend aquí.
  // Mantenemos el setup de datos de la imagen para el foco visual.
});

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
};

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showNotify('Las contraseñas no coinciden', 'negative');
    return;
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    showNotify('La nueva contraseña debe tener al menos 6 caracteres', 'negative');
    return;
  }

  loading.value = true;
  try {
    // 🔹 Aquí iría la llamada a tu API:
    // await api.put(`/api/usuarios-colegio/${auth.user.id}/change-password`, { ... });
    
    // Simulación de éxito
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    showNotify('Contraseña actualizada correctamente', 'positive');
    resetPasswordForm();
  } catch (error) {
    // Simulación de error
    showNotify('Error al cambiar la contraseña', 'negative');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/*
  Las tarjetas con 'flat' y 'bordered' de Quasar ya tienen un estilo similar.
  El layout se maneja con el sistema de grid (row, col) y clases de espaciado (q-pa-md, q-mb-md, etc.).
  Ajustamos un poco las clases para replicar la apariencia limpia.
*/
.my-card {
  border-radius: 12px; /* Un poco de borde redondeado para un look moderno */
}
</style>