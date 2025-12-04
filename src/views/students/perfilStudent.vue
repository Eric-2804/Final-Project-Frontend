<template>
  <q-page class="q-pa-md bg-grey-2">

    <HeaderComponent
      :leftDrawerOpen="leftDrawerOpen"
      :toggleLeftDrawer="toggleLeftDrawer"
    />
    <h3 class="q-mb-md text-h5 text-weight-bold">Mi Perfil</h3>

    <div class="row q-col-gutter-lg" v-if="estudiante">
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
                  <div class="text-subtitle2 text-primary">{{ estudiante.rol }}</div>
                </q-card>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Cambiar contraseña</div>
                  <div class="text-caption text-grey q-mb-sm">Actualice su contraseña</div>

                  <q-form @submit.prevent="handleChangePassword">
                    <q-input
                      filled dense v-model="passwordForm.currentPassword"
                      type="password" label="Contraseña Actual" class="q-mb-sm"
                      required autocomplete="current-password"
                    />
                    <q-input
                      filled dense v-model="passwordForm.newPassword"
                      type="password" label="Nueva Contraseña" class="q-mb-sm"
                      required autocomplete="new-password"
                    />
                    <q-input
                      filled dense v-model="passwordForm.confirmPassword"
                      type="password" label="Confirmar Nueva Contraseña" class="q-mb-md"
                      required autocomplete="new-password"
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
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Información de Contacto y Documentación</div>
                  
                  <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Email:</div><div class="text-body1 text-weight-medium">{{ estudiante.email }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Teléfono:</div><div class="text-body1 text-weight-medium">{{ estudiante.telefono }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Dirección:</div><div class="text-body1 text-weight-medium">{{ estudiante.direccion }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Tipo Documento:</div><div class="text-body1 text-weight-medium">{{ estudiante.tipoDocumento }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Número Documento:</div><div class="text-body1 text-weight-medium">{{ estudiante.numeroDocumento }}</div></div>
                    <div class="col-xs-12 col-sm-6"><div class="text-caption text-grey">Núcleo Educativo:</div><div class="text-body1 text-weight-medium">{{ estudiante.nucleoEducativo }}</div></div>
                  </div>
                </q-card>
              </div>

              <div class="col-xs-12">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Información Adicional y de Salud</div>
                  
                  <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
                    <div class="col-xs-12 col-sm-4"><div class="text-caption text-grey">Fecha Nacimiento:</div><div class="text-body1 text-weight-medium">{{ estudiante.fechaNacimiento }}</div></div>
                    <div class="col-xs-12 col-sm-4"><div class="text-caption text-grey">Estrato:</div><div class="text-body1 text-weight-medium">{{ estudiante.estrato }}</div></div>
                    <div class="col-xs-12 col-sm-4"><div class="text-caption text-grey">EPS:</div><div class="text-body1 text-weight-medium">{{ estudiante.eps }}</div></div>
                    <div class="col-xs-12 col-sm-4"><div class="text-caption text-grey">Tipo de Sangre:</div><div class="text-body1 text-weight-medium">{{ estudiante.tipoSangre }}</div></div>
                    <div class="col-xs-12 col-sm-4"><div class="text-caption text-grey">Población Víctima:</div><div class="text-body1 text-weight-medium">{{ estudiante.poblacionVictima }}</div></div>
                    <div class="col-xs-12 col-sm-4"><div class="text-caption text-grey">Discapacidad:</div><div class="text-body1 text-weight-medium">{{ estudiante.discapacidad }}</div></div>
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
    
    <div v-else>
      <p>Cargando datos del estudiante...</p>
      <q-spinner color="primary" size="3em" />
    </div>
    <FooterComponent />
  </q-page>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../store/authStore'; 
import { useNotify } from '../../composables/useNotify'; 
import api from '../../services/api'; 
import HeaderComponent from '../../components/Header.vue';
import FooterComponent from '../../components/Footer.vue';

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const auth = useAuthStore();
const { showNotify } = useNotify(); 

const estudiante = ref(null);
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const loading = ref(false);

onMounted(async () => {
  try {
    const userId = auth.user?.id || 'ID_DEL_USUARIO_ACTUAL'; 
    
    estudiante.value = {
      nombres: "Sayury", apellidos: "Rodríguez", rol: "Estudiante", email: "sayury@example.com",
      nucleoEducativo: "Núcleo educativo central", fotoUrl: 'https://i.imgur.com/rN1f6zO.png',
      tipoDocumento: "CC", numeroDocumento: "123456789", telefono: "3001234567",
      direccion: "Calle 10 #5-20", fechaNacimiento: "2002-05-20", estrato: 3,
      eps: "Sura", tipoSangre: "O+", poblacionVictima: "No", discapacidad: "Ninguna"
    };

    /* // 🔹 CÓDIGO REAL DEL BACKEND - DESCOMENTAR CUANDO 'api' ESTÉ CONFIGURADO
    // Endpoint para obtener datos del usuario: GET /api/usuarios-colegio/:id
    const response = await api.get(`/api/usuarios-colegio/${userId}`);
    estudiante.value = response.data;
    */

  } catch (error) {
    showNotify('Error al cargar los datos del estudiante', 'negative');
    console.error("Error al cargar datos:", error);
  }
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
  const userId = auth.user?.id || 'ID_DEL_USUARIO_ACTUAL';
  
  try {
    // 🔹 Endpoint para cambiar contraseña: PUT /api/usuarios-colegio/:id/change-password
    await api.put(`/api/usuarios-colegio/${userId}/change-password`, {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    showNotify('Contraseña actualizada correctamente', 'positive');
    resetPasswordForm();
  } catch (error) {
    // Generalmente, este error indica que la `currentPassword` fue incorrecta.
    showNotify('Error al cambiar la contraseña. Verifique la contraseña actual.', 'negative');
    console.error("Error al cambiar contraseña:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.my-card {
  border-radius: 12px;
}
</style>