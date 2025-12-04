<template>
  <q-page class="q-pa-md bg-grey-2">
    <h3 class="q-mb-md text-h5 text-weight-bold">Mi Perfil</h3>

    <div v-if="loading" class="loading-spinner">
      <q-spinner-dots color="primary" size="50px" />
      <p>Cargando perfil...</p>
    </div>
    <div v-if="error" class="error-message">
      <q-icon name="warning" color="negative" size="50px" />
      <p>Error al cargar el perfil: {{ error }}</p>
    </div>

    <div class="row q-col-gutter-lg" v-if="profile && !loading">
      <div class="col-xs-12 col-md-8">
        <q-card flat class="my-card">
          <q-card-section>
            <div class="row q-col-gutter-lg">
              <div class="col-xs-12 col-sm-6">
                <q-card flat bordered class="q-pa-md text-center">
                  <q-avatar size="100px" class="q-mb-md">
                    <img :src="profile.profilePhoto || 'https://cdn.quasar.dev/img/avatar.png'" @click="changePhoto">
                  </q-avatar>
                  <div class="text-h6">{{ profile.names }} {{ profile.lastNames }}</div>
                  <div class="text-subtitle2 text-primary">{{ profile.roles?.[0] }}</div>
                </q-card>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Cambiar contraseña</div>
                  <q-form @submit.prevent="changePassword">
                    <q-input filled dense v-model="password.new" type="password" label="Nueva Contraseña" class="q-mb-sm" required autocomplete="new-password" />
                    <q-input filled dense v-model="password.confirm" type="password" label="Confirmar Nueva Contraseña" class="q-mb-md" required autocomplete="new-password" />
                    <div class="row justify-end q-gutter-sm">
                      <q-btn flat label="Cancelar" color="grey" @click="resetPasswordForm" />
                      <q-btn type="submit" label="Guardar Cambios" color="primary" />
                    </div>
                  </q-form>
                </q-card>
              </div>

              <div class="col-xs-12">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Información de Contacto y Documentación</div>
                  <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Email:</div><div class="text-body1 text-weight-medium">{{ profile.email }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Teléfono:</div><div class="text-body1 text-weight-medium">{{ profile.cellphone }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Dirección:</div><div class="text-body1 text-weight-medium">{{ profile.direction }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Tipo Documento:</div><div class="text-body1 text-weight-medium">{{ profile.typeDocument }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Número Documento:</div><div class="text-body1 text-weight-medium">{{ profile.numberDocument }}</div></div>
                  </div>
                </q-card>
              </div>

              <div class="col-xs-12">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Firma Digital</div>
                  <div class="signature-section">
                    <div class="signature-preview">
                      <img v-if="profile.signDigital" :src="profile.signDigital" alt="Firma Digital">
                      <div v-else class="signature-placeholder">
                        <q-icon name="image" size="40px" />
                        <p>No hay firma digital</p>
                      </div>
                    </div>
                    <q-btn label="Cambiar Firma" color="secondary" @click="changeSignature" class="q-mt-md" />
                  </div>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';

const $q = useQuasar();
const authStore = useAuthStore();

const password = ref({ new: '', confirm: '' });

const profile = computed(() => {
  if (!authStore.user) {
    return null;
  }
  return {
    ...authStore.user,
    names: authStore.user.names || 'Usuario',
    lastNames: authStore.user.lastNames || 'Rector',
    email: authStore.user.email || 'rector@example.com',
    cellphone: authStore.user.cellphone || 'N/A',
    direction: authStore.user.direction || 'N/A',
    typeDocument: authStore.user.typeDocument || 'N/A',
    numberDocument: authStore.user.numeroDocumento || 'N/A',
    profilePhoto: null, // Always use fallback
    signDigital: null,
    roles: authStore.user.roles || ['rector'],
  };
});

const loading = computed(() => !authStore.isAuthReady);
const error = computed(() => {
    if (authStore.isAuthReady && !authStore.user) {
        return 'Usuario no autenticado.';
    }
    return null;
});


const changePhoto = () => {
  $q.notify({ type: 'info', message: 'Esta funcionalidad no está disponible en este momento.' });
};

const changeSignature = () => {
  $q.notify({ type: 'info', message: 'Esta funcionalidad no está disponible en este momento.' });
};

const resetPasswordForm = () => {
  password.value.new = '';
  password.value.confirm = '';
};

const changePassword = async () => {
  $q.notify({ type: 'info', message: 'Esta funcionalidad no está disponible en este momento.' });
  resetPasswordForm();
};
</script>

<style scoped>
.my-card {
  border-radius: 12px;
}
.loading-spinner,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  gap: 16px;
}
.signature-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.signature-preview {
  width: 100%;
  max-width: 300px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  overflow: hidden;
}
.signature-preview img {
  max-width: 100%;
  max-height: 100%;
}
.signature-placeholder {
  text-align: center;
  color: #888;
}
</style>