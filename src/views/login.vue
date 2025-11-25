<template>
  <div class="containerLogin">
    <div class="login">
      <h1>Bienvenido</h1>
      <h2>Inicie sesión para continuar</h2>

      <q-form @submit.prevent="handleLogin" class="form">
        <h2>Selecciona tu rol</h2>
        <q-select outlined v-model="role"
          :options="['Administrador', 'Rector', 'Coordinador', 'Acudiente', 'Estudiante', 'Profesor']" label="Opciones"
          class="input" :rules="[val => !!val || 'Debe seleccionar un rol']" lazy-rules />

        <h2>Correo electrónico</h2>
        <q-input outlined v-model="email" label="usuario@gmail.com" class="input" type="email" :rules="emailRules"
          lazy-rules />

        <h2>Contraseña</h2>
        <q-input outlined v-model="password" type="password" label="Ingrese su contraseña" class="input"
          :rules="passwordRules" lazy-rules />

        <h2>Año</h2>
        <q-select outlined v-model="year" :options="['2023', '2024', '2025']" label="Seleccione el año" class="input"
          :rules="[val => !!val || 'Debe seleccionar un año']" lazy-rules />

        <a href="#" class="recover">Recuperar Contraseña</a>

        <q-dialog v-model="isRecoverModalOpen">
          <q-card class="modalRegister">
            <q-btn icon="close" flat round dense v-close-popup class="closeBtn" />
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu correo para recibir un enlace de recuperación.</p>
            <q-input outlined v-model="recoverEmail" label="Correo electrónico" type="email" class="input" />
            <Button :loading="loadingRecover" color="primary" label="Enviar enlace" @click="handleRecoverPassword" />
            <p v-if="recoverMsg" class="success-msg">{{ recoverMsg }}</p>
          </q-card>
        </q-dialog>

        <Button :loading="loading" color="primary" label="Iniciar Sesión" type="submit"
          style="width: 100%; border-radius: 5px; margin-top: 10px; margin-bottom: 10px;" />

        <router-link to="/register" class="register">¿No tienes una cuenta? Regístrate</router-link>

        <p v-if="loginErrorMsg" class="error-msg">{{ loginErrorMsg }}</p>
      </q-form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Button from '../components/Button.vue'
import { login, recoverPassword } from '../services/authService';

const router = useRouter()
const authStore = useAuthStore()

// 🔥 variables reactivas
const role = ref('Estudiante')
const email = ref('')
const password = ref('')
const year = ref('2024')
const loginErrorMsg = ref('')
const loading = ref(false)



// variables para el modal de recuperación
const isRecoverModalOpen = ref(false)
const recoverEmail = ref('')
const recoverMsg = ref('')
const loadingRecover = ref(false)

// 🔥 Reglas de validación
const emailRules = [
  (val) => !!val || 'El correo es obligatorio',
  (val) => /.+@.+\..+/.test(val) || 'Ingrese un correo electrónico válido'
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
     // El endpoint correcto es /api/usuarios-colegio/login 
     const response = await login({ 
       email: email.value, 
       password: password.value 
     }) 
     
     const { token, user } = response 
     authStore.login(token, user) 
     
     // Redirigir según el rol del usuario 
     switch (user.roles[0]) { 
       case 'Administrador': 
         router.push('/management') 
         break 
       case 'Rector': 
         router.push('/rector') 
         break 
       case 'Coordinador': 
         router.push('/dashboardCoordinator') 
         break 
       case 'Acudiente': 
         router.push('/DashboardGuardian') 
         break 
       case 'Estudiante': 
         router.push('/dashboard') 
         break 
       case 'Profesor': 
         router.push('/teacherDashboard') 
         break 
       default: 
         router.push('/home') 
     } 
   } catch (error) { 
     if (error.response) { 
       loginErrorMsg.value = error.response.data.message || 'Error al iniciar sesión' 
     } else { 
       loginErrorMsg.value = 'Error de red o el servidor no responde.' 
     } 
   } finally { 
     loading.value = false 
   } 
 } 
 
 // Agrega la función de recuperación de contraseña: 
 const handleRecoverPassword = async () => { 
   if (!recoverEmail.value) { 
     recoverMsg.value = 'Por favor ingresa tu correo electrónico' 
     return 
   } 
   
   loadingRecover.value = true 
   recoverMsg.value = '' 
   
   try { 
     await recoverPassword(recoverEmail.value) 
     recoverMsg.value = 'Se ha enviado un enlace de recuperación a tu correo' 
   } catch (error) { 
     recoverMsg.value = error.response?.data?.message || 'Error al enviar el enlace' 
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
 height: auto;
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
 margin-bottom: 15px;
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
}

.error-msg {
 color: red;
 text-align: center;
 margin-top: 1px;
}

.closeBtn {
 position: absolute;
 top: 10px;
 right: 10px;
 z-index: 10;
}
</style>