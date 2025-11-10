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

          <a href="#" class="register">¿No tienes una cuenta? Regístrate</a>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </q-form>
    </div>
    <div class="containerRegister">
         <q-btn label="Alert" color="primary" @click="alert = true" />

    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
      <q-form @submit.prevent="showSpinner" class="form">
         <h2>Nombre Completo</h2>
        <q-input outlined v-model="fullName" label="Sayury Yuliana Rodríguez Pinzón" class="input" type="fullName" :rules="fullNameRules"
          lazy-rules />
       
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

          <h2>Confirmar Contraseña</h2>
        <q-input outlined v-model="password" type="password" label="Confirme su contraseña" class="input"
          :rules="passwordRules" lazy-rules />

        <Button :loading="loading" color="primary" label="Crear Cuenta" type="submit"
          style="width: 100%; border-radius: 5px; margin-top: 10px; margin-bottom: 10px;" />
      </q-form>


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

const alert = ref(false)
const confirm = ref(false)
const prompt = ref(false)
const address = ref('')

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

.containerLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #E5E7EB;
  height: auto;
}

.login {
  margin-top: 17px;
  width: 400px;
  height: auto;
  background: white;
  border-radius: 10px;
  border: 2px solid #3b82f6;
  text-align: center;
  box-shadow: 1px 1px 1px 0px #3b82f6;
  margin-bottom: 17px;
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
</style>