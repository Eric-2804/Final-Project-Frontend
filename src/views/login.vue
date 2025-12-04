<template>
  <div class="containerLogin">
    <div class="login">
      <h1>Bienvenido</h1>
      <h2>Inicie sesión para continuar</h2>

      <q-form @submit.prevent="handleLogin" class="form">
        <h2>Selecciona tu rol</h2>
        <q-select outlined v-model="role"
          :options="['Administrador', 'Rector', 'Coordinador', 'Secretaria', 'Acudiente', 'Estudiante', 'Profesor']" label="Opciones"
          class="input" :rules="[val => !!val || 'Debe seleccionar un rol']" lazy-rules />

        <h2>Número de Identificación</h2>
        <q-input outlined v-model="identificationNumber" label="Número de Identificación" class="input" type="text" :rules="identificationNumberRules"
          lazy-rules />

        <h2>Contraseña</h2>
        <q-input outlined v-model="password" type="password" label="Ingrese su contraseña" class="input"
          :rules="passwordRules" lazy-rules />

        <h2>Año</h2>
        <q-select outlined v-model="year" :options="['2023', '2024', '2025']" label="Seleccione el año" class="input"
          :rules="[val => !!val || 'Debe seleccionar un año']" lazy-rules />

        <a href="#" @click.prevent="openRecoverModal" class="recover">Recuperar Contraseña</a>

        <q-dialog v-model="isRecoverModalOpen">
          <q-card class="modalRegister">
            <q-btn icon="close" flat round dense v-close-popup class="closeBtn" />
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu número de identificación para recibir un enlace de recuperación.</p>
            <q-input outlined v-model="recoverIdentificationNumber" label="Número de Identificación" type="text" class="input" />
            <q-btn :loading="loadingRecover" color="primary" label="Enviar enlace" @click="handleRecoverPassword" />
            <p v-if="recoverMsg" class="success-msg">{{ recoverMsg }}</p>
          </q-card>
        </q-dialog>

        <q-btn :loading="loading" color="primary" label="Iniciar Sesión" type="submit"
          style="width: 100%; border-radius: 5px; margin-top: 10px; margin-bottom: 10px;" />

        <router-link to="/register" class="register">¿No tienes una cuenta? Regístrate</router-link>

        <p v-if="loginErrorMsg" class="error-msg">{{ loginErrorMsg }}</p>
      </q-form>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth.js'
import { login, recoverPassword } from '../services/authService';

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

// 🔥 variables reactivas
const role = ref('Estudiante')
const identificationNumber = ref('')
const password = ref('')
const year = ref('2024')
const loginErrorMsg = ref('')
const loading = ref(false)

// variables para el modal de recuperación
const isRecoverModalOpen = ref(false)
const recoverIdentificationNumber = ref('') // 🔹 Cambiado de recoverEmail
const recoverMsg = ref('')
const loadingRecover = ref(false)

const openRecoverModal = () => {
  isRecoverModalOpen.value = true;
  recoverMsg.value = '';
  recoverIdentificationNumber.value = '';
}

// 🔥 Reglas de validación
const identificationNumberRules = [
  (val) => !!val || 'El número de identificación es obligatorio'
]
const passwordRules = [
  (val) => !!val || 'La contraseña es obligatoria',
  (val) => val.length >= 8 || 'Debe tener al menos 8 caracteres'
]

// 🔥 Lógica para el login
 const handleLogin = async () => {
   loading.value = true
   loginErrorMsg.value = ''

   try {
     const response = await login({
       numberDocument: identificationNumber.value,
       password: password.value,
       role: role.value,
       year: year.value
     })

     const { token, user } = response;

     if (!token || !user) {
        loginErrorMsg.value = 'Respuesta inválida del servidor. Faltan datos de autenticación.';
        return;
     }

     await authStore.login(token, user)

     const userRole = authStore.user?.rol;

     // ✨ Nueva validación de rol
     if (role.value.toLowerCase() !== userRole.toLowerCase()) {
        $q.notify({ type: 'negative', message: 'El rol seleccionado no coincide con el rol del usuario.' });
        authStore.logout(); // Limpiamos cualquier estado de autenticación parcial
        return;
     }

     if (!userRole) {
        loginErrorMsg.value = 'Respuesta inválida: el usuario no tiene un rol asignado en el sistema.';
        authStore.logout();
        return;
     }

     // ✅ Redirección corregida con las rutas correctas
     const roleRoutes = {
        administrador: '/management',
        rector: '/rector/dashboard',
        coordinador: '/dashboardCoordinator',
        secretaria: '/secretaria/dashboard',
        profesor: '/teacher/dashboard',
        acudiente: '/DashboardGuardian',
        estudiante: '/student/dashboard'
     };

     const redirectPath = roleRoutes[userRole] || '/home';
     router.push(redirectPath);

   } catch (error) {
     console.error('Error durante el login:', error);
     if (error.response && error.response.data && error.response.data.message) {
       loginErrorMsg.value = error.response.data.message;
     } else if (error.response) {
       loginErrorMsg.value = 'Error al iniciar sesión. Verifique sus credenciales y permisos.';
     }
     else {
       loginErrorMsg.value = 'Error de red o el servidor no responde.'
     }
   } finally {
     loading.value = false
   }
 }

 // 🔹 Lógica de recuperación de contraseña actualizada
 const handleRecoverPassword = async () => {
   if (!recoverIdentificationNumber.value) {
     recoverMsg.value = 'Por favor ingresa tu número de identificación'
     return
   }

   loadingRecover.value = true
   recoverMsg.value = ''

   try {
     // Se asume que el servicio espera el número de documento
     await recoverPassword({ numberDocument: recoverIdentificationNumber.value })
     // Mensaje genérico por seguridad para no confirmar si el usuario existe
     recoverMsg.value = 'Si los datos son correctos, se ha enviado un enlace de recuperación al correo asociado a tu cuenta.'
   } catch (error) {
     console.error('Error en recuperación:', error);
     // Se muestra el mismo mensaje en caso de error para evitar enumeración de usuarios
     recoverMsg.value = 'Si los datos son correctos, se ha enviado un enlace de recuperación al correo asociado a tu cuenta.'
   } finally {
     loadingRecover.value = false
   }
 }
</script>

<style scoped>
* {
 font-family: 'Inter', sans-serif;
 margin: 0;
}

.containerRegister,
.containerLogin {
 display: flex;
 justify-content: center;
 align-items: center;
 background-color: #E5E7EB;
 height: 100vh;
}

.modalRegister {
 width: 420px;
 min-height: 618px;
 background: white;
 border-radius: 10px;
 border: 3px solid #3b82f6;
 text-align: center;
 box-shadow: 1px 1px 1px 0px #3b82f6;
 padding-top: 20px;
 margin-top: -9px;
}

.login {
 margin-top: 15px;
 width: 400px;
 min-height: 600px;
 background: white;
 border-radius: 10px;
 border: 2px solid #3b82f6;
 text-align: center;
 box-shadow: 1px 1px 1px 0px #3b82f6;
}

.modalRegister h1,
.login h1 {
 font-size: 42px;
 color: #1e1e1e;
 margin-top: 20px;
 line-height: 30px;
}

.modalRegister h2,
.login h2 {
 font-size: 16px;
 color: #6b7280;
 margin: 0px;
 line-height: 25px;
 margin-bottom: 12px;
}

.form {
 width: 330px;
 margin: 0 auto;
 text-align: left;
}

.form h2 {
 color: #1e1e1e;
 font-size: 15px;
 margin: 0px 0 0px 0;
}

.input {
 width: 100%;
}

.register {
 display: block;
 text-align: center;
 font-size: 14px;
 color: #2563eb;
 text-decoration: none;
 text-align: center;
 margin-bottom: 17px;
}

.recover {
 display: block;
 text-align: center;
 font-size: 14px;
 color: #2563eb;
 text-decoration: none;
 text-align: right;
 cursor: pointer;
}

.error-msg {
 color: red;
 text-align: center;
 margin-top: 1px;
}

.success-msg {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.closeBtn {
 position: absolute;
 top: 10px;
 right: 10px;
 z-index: 10;
}
</style>