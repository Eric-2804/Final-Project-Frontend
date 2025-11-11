<template>
  <div class="containerLogin">

    <div class="login">
      <h1>Bienvenido</h1>
      <h2>Inicie sesión para continuar</h2>

      <q-form @submit.prevent="showSpinner" class="form">
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

        <Button :loading="loading" color="primary" label="Iniciar Sesión" type="submit"
          style="width: 100%; border-radius: 5px; margin-top: 10px; margin-bottom: 10px;" />

        <a href="#" class="register" @click.prevent="modalRegistro = true" >¿No tienes una cuenta? Regístrate</a>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </q-form>
    </div>
    <div class="containerRegister">
    <q-dialog v-model="modalRegistro">
      <q-card class="modalRegister"> 
        <q-btn icon="close" flat round dense v-close-popup class="closeBtn" />
        <h1>Bienvenido</h1>
        <h2>Regístrese para continuar</h2>

        <q-form @submit.prevent="showSpinner" class="form">

        <h2>Selecciona tu rol</h2>
        <q-select outlined v-model="role"
          :options="['Administrador', 'Rector', 'Coordinador', 'Acudiente', 'Estudiante', 'Profesor']" label="Opciones"
          class="input" :rules="[val => !!val || 'Debe seleccionar un rol']" lazy-rules />

         <h2>Nombres</h2>
        <q-input outlined v-model="fullName" label="Sayury Yuliana" class="input" type="fullName" :rules="fullNameRules"
          lazy-rules />

        <h2>Apellidos</h2>
        <q-input outlined v-model="apellidos" label="Rodríguez Pinzón" class="input" type="apellidos" :rules="apellidosRules"
          lazy-rules />

        <h2>Tipo de Documento</h2>
        <q-select outlined v-model="tipoDocumento"
        :options="['Tarjeta de Identidad', 'Cédula de Ciudadanía']" label="Opciones"
        class="input" :rules="[val => !!val || 'Debe seleccionar el tipo de documento']" lazy-rules />

        <h2>Número de Documento</h2>
        <q-input outlined v-model="apellidos" label="1095510403" class="input" type="numeroDoc" :rules="numDocumentoRules"
          lazy-rules />
       
        <h2>Correo electrónico</h2>
        <q-input outlined v-model="registerEmail" label="usuario@gmail.com" class="input" type="registerEmail" :rules="registerEmailRules"
          lazy-rules />

        <h2>Contraseña</h2>
        <q-input outlined v-model="registerPassword" type="registerPassword" label="Ingrese su contraseña" class="input"
          :rules="registerPasswordRules" lazy-rules />

        <h2>Número de Teléfono</h2>
        <q-input outlined v-model="registerNumTelefono" type="registerNumTelefono" label="3123460633" class="input"
          :rules="registerNumTelefonoRules" lazy-rules />

        <h2>Dirección</h2>
        <q-input outlined v-model="registerDireccion" type="registerDireccion" label="Calle 28 6-35" class="input"
          :rules="registerDireccionRules" lazy-rules />

        <h2>Fecha de Nacimiento</h2>
        <q-input outlined v-model="registerFechaNacimiento" type="registerFechaNacimiento" label="15-09-2006" class="input"
          :rules="registerFechaNacimientoRules" lazy-rules />

        <h2>Estrato</h2>
        <q-select outlined v-model="registerEstrato"
        :options="['Tarjeta de Identidad', 'Cédula de Ciudadanía']" label="Opciones"
        class="input" :rules="[val => !!val || 'Debe seleccionar el tipo de documento']" lazy-rules />






        <Button :loading="loading" color="primary" label="Crear Cuenta" type="submit"
          style="width: 100%; border-radius: 5px; margin-top: 10px; margin-bottom: 20px;" />
      </q-form>
      </q-card>
    </q-dialog>
     

    </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button.vue";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const role = ref("");
const year = ref("");
const errorMsg = ref("");
const loading = ref(false);

const modalRegistro = ref(false);
const fullName = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const confirmPassword = ref("");
const registerRole = ref(""); 
const loadingRegister = ref(false);
const errorMsgRegister = ref("");

// const alert = ref(false)
// const confirm = ref(false)
// const prompt = ref(false)
// const address = ref('')

const emailRules = [
  val => !!val || "El correo es obligatorio",
  val => /.+@.+\..+/.test(val) || "Ingrese un correo electrónico válido",
];

const passwordRules = [
  val => !!val || "La contraseña es obligatoria",
  val => val.length >= 8 || "Debe tener al menos 8 caracteres",
  val => /[A-Z]/.test(val) || "Debe tener al menos una letra mayúscula",
  val => /[a-z]/.test(val) || "Debe tener al menos una letra minúscula",
  val => /[0-9]/.test(val) || "Debe incluir al menos un número",
  val => /[^A-Za-z0-9]/.test(val) || "Debe incluir un carácter especial",
];

const showSpinner = async () => {
  errorMsg.value = "";

  loading.value = true;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        role: role.value,
        year: Number(year.value)
      }),
    });

    const data = await response.json();

    if (response.ok) {
      auth.user = { email: email.value, role: role.value };
      auth.token = data.token || "fakeToken"; 
      localStorage.setItem("user", JSON.stringify(auth.user));
      localStorage.setItem("token", auth.token);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      errorMsg.value = data.message || "Error desconocido al iniciar sesión.";
    }
  } catch (err) {
    errorMsg.value =
      "Error de conexión. Asegúrate de que el servidor esté encendido.";
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 3000);
  }
};
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

.modalRegister{
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

.register{
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

.closeBtn{
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
