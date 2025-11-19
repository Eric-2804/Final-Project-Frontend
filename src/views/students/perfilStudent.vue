<template>
  <q-page class="q-pa-md bg-grey-2">
<<<<<<< HEAD
    <h3 class="q-mb-md text-h5 text-weight-bold">Mi Perfil</h3>

    <div class="row q-col-gutter-lg">
=======

    <HeaderComponent
      :leftDrawerOpen="leftDrawerOpen"
      :toggleLeftDrawer="toggleLeftDrawer"
    />
    <h3 class="q-mb-md text-h5 text-weight-bold">Mi Perfil</h3>

    <div class="row q-col-gutter-lg" v-if="estudiante">
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
      <div class="col-xs-12 col-md-8">
        <q-card flat class="my-card">
          <q-card-section>
            <div class="row q-col-gutter-lg">
<<<<<<< HEAD
=======
              
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
              <div class="col-xs-12 col-sm-6">
                <q-card flat bordered class="q-pa-md text-center">
                  <q-avatar size="100px" class="q-mb-md">
                    <img :src="estudiante?.fotoUrl || 'https://cdn.quasar.dev/img/avatar.png'">
                  </q-avatar>
                  <div class="text-h6">{{ estudiante.nombres }} {{ estudiante.apellidos }}</div>
<<<<<<< HEAD
=======
                  <div class="text-subtitle2 text-primary">{{ estudiante.rol }}</div>
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
                </q-card>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-subtitle1 text-weight-medium q-mb-md">Cambiar contraseña</div>
                  <div class="text-caption text-grey q-mb-sm">Actualice su contraseña</div>

                  <q-form @submit.prevent="handleChangePassword">
                    <q-input
<<<<<<< HEAD
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
=======
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
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
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
<<<<<<< HEAD
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
=======
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

>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-md-4">
        </div>
    </div>
<<<<<<< HEAD
  </q-page>
=======
    
    <div v-else>
      <p>Cargando datos del estudiante...</p>
      <q-spinner color="primary" size="3em" />
    </div>
    <FooterComponent />
  </q-page>
  
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
</template>

<script setup>
import { ref, onMounted } from 'vue';
<<<<<<< HEAD
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

=======
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
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
<<<<<<< HEAD

const loading = ref(false);

// 🔹 Usa datos de prueba para probar la vista
onMounted(() => {
  // En una aplicación real, harías una llamada al backend aquí.
  // Mantenemos el setup de datos de la imagen para el foco visual.
=======
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
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
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
<<<<<<< HEAD
  
=======
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
  if (passwordForm.value.newPassword.length < 6) {
    showNotify('La nueva contraseña debe tener al menos 6 caracteres', 'negative');
    return;
  }

  loading.value = true;
<<<<<<< HEAD
  try {
    // 🔹 Aquí iría la llamada a tu API:
    // await api.put(/api/usuarios-colegio/${auth.user.id}/change-password, { ... });
    
    // Simulación de éxito
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    showNotify('Contraseña actualizada correctamente', 'positive');
    resetPasswordForm();
  } catch (error) {
    // Simulación de error
    showNotify('Error al cambiar la contraseña', 'negative');
=======
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
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
<<<<<<< HEAD
/*
  Las tarjetas con 'flat' y 'bordered' de Quasar ya tienen un estilo similar.
  El layout se maneja con el sistema de grid (row, col) y clases de espaciado (q-pa-md, q-mb-md, etc.).
  Ajustamos un poco las clases para replicar la apariencia limpia.
*/
.my-card {
  border-radius: 12px; /* Un poco de borde redondeado para un look moderno */
=======
.my-card {
  border-radius: 12px;
>>>>>>> a5782ef7bb34ba11441b092c06405e0e7f4273ad
}
</style>