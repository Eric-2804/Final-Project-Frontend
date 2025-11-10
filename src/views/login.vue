<template>
  <div class="contenedorLogin">
    <div class="login">
      <h1>Bienvenido</h1>
      <h2>Inicie sesión para continuar</h2>

      <q-form @submit.prevent="showSpinner" class="formulario">
        <h2>Selecciona tu rol</h2>
        <q-select outlined v-model="rol"
          :options="['Administrador', 'Rector', 'Coordinador', 'Acudiente', 'Estudiante', 'Profesor']" label="Opciones"
          class="input" :rules="[val => !!val || 'Debe seleccionar un rol']" lazy-rules />

        <h2>Correo electrónico</h2>
        <q-input outlined v-model="correo" label="usuario@gmail.com" class="input" type="email" :rules="correoRules"
          lazy-rules />

        <h2>Contraseña</h2>
        <q-input outlined v-model="contrasena" type="password" label="Ingrese su contraseña" class="input"
          :rules="contrasenaRules" lazy-rules />

        <h2>Año</h2>
        <q-select outlined v-model="anio" :options="['2023', '2024', '2025']" label="Seleccione el año" class="input"
          :rules="[val => !!val || 'Debe seleccionar un año']" lazy-rules />

        <a href="#" class="recuperar">Recuperar Contraseña</a>

        <BaseButton :loading="loading" color="primary" label="Iniciar Sesión" type="submit"
          style="width: 100%; border-radius: 5px; margin-top: 15px; margin-bottom: 15px;" />

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
//import BaseButton from "../components/BaseButton.vue";

const router = useRouter();
const auth = useAuthStore();

const correo = ref("");
const contrasena = ref("");
const rol = ref("");
const anio = ref("");
const errorMsg = ref("");
const loading = ref(false);

const correoRules = [
  val => !!val || "El correo es obligatorio",
  val => /.+@.+\..+/.test(val) || "Ingrese un correo electrónico válido",
];

const contrasenaRules = [
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
        correo: correo.value,
        contraseña: contrasena.value,
        rol: rol.value,
        año: anio.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
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

.contenedorLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #E5E7EB;
  height: auto;
}

.login {
  margin-top: 30px;
  width: 400px;
  height: auto;
  background: white;
  border-radius: 10px;
  border: 2px solid #3b82f6;
  text-align: center;
  box-shadow: 1px 1px 1px 0px #3b82f6;
  margin-bottom: 30px;
}

.login h1 {
  font-size: 42px;
  color: #1e1e1e;
  margin-top: 20px;
  line-height: 30px;
}

.login h2 {
  font-size: 16px;
  color: #6b7280;
  margin: 0px;
  line-height: 25px;
  margin-bottom: 12px;
}

.formulario {
  width: 330px;
  margin: 0 auto;
  text-align: left;
}

.formulario h2 {
  color: #1e1e1e;
  font-size: 15px;
  margin: 0px 0 0px 0;
}

.input {
  width: 100%;
}

.recuperar {
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
</style>