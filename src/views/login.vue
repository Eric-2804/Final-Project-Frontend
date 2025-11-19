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

        <a href="#" class="register" @click.prevent="isRegisterModalOpen = true">¿No tienes una cuenta? Regístrate</a>

        <p v-if="loginErrorMsg" class="error-msg">{{ loginErrorMsg }}</p>
      </q-form>
    </div>
    <div class="containerRegister">
      <q-dialog v-model="isRegisterModalOpen">
        <q-card class="modalRegister">
          <q-btn icon="close" flat round dense v-close-popup class="closeBtn" />
          <h1>Bienvenido</h1>
          <h2>Regístrese para continuar</h2>

          <q-form @submit.prevent="handleRegister" class="form">

            <h2>Selecciona tu rol</h2>
            <q-select outlined v-model="registerRole"
              :options="['Administrador', 'Rector', 'Coordinador', 'Acudiente', 'Estudiante', 'Profesor']"
              label="Opciones" class="input" :rules="[val => !!val || 'Debe seleccionar un rol']" lazy-rules />

            <h2>Nombres</h2>
            <q-input outlined v-model="firstName" label="Sayury Yuliana" class="input" :rules="nameRules" lazy-rules />

            <h2>Apellidos</h2>
            <q-input outlined v-model="lastName" label="Rodríguez Pinzón" class="input" :rules="nameRules" lazy-rules />

            <h2>Tipo de Documento</h2>
            <q-select outlined v-model="documentType"
              :options="['Tarjeta de Identidad', 'Cédula de Ciudadanía', 'Cédula de Extranjería']" label="Opciones"
              class="input" :rules="[val => !!val || 'Debe seleccionar el tipo de documento']" lazy-rules />

            <h2>Número de Documento</h2>
            <q-input outlined v-model="documentNumber" label="1095510403" class="input" type="number"
              :rules="documentNumberRules" lazy-rules />

            <h2>Correo electrónico</h2>
            <q-input outlined v-model="registerEmail" label="usuario@gmail.com" class="input" type="email"
              :rules="emailRules" lazy-rules />

            <h2>Contraseña</h2>
            <q-input outlined v-model="registerPassword" type="password" label="Ingrese su contraseña" class="input"
              :rules="passwordRules" lazy-rules />

            <h2>Confirmar Contraseña</h2>
            <q-input outlined v-model="confirmPassword" type="password" label="Confirme su contraseña" class="input"
              :rules="confirmPasswordRules" lazy-rules />

            <h2>Número de Teléfono</h2>
            <q-input outlined v-model="phoneNumber" type="tel" label="3123460633" class="input"
              :rules="phoneNumberRules" lazy-rules />

            <h2>Dirección</h2>
            <q-input outlined v-model="address" type="text" label="Calle 28 6-35" class="input" :rules="addressRules"
              lazy-rules />

            <h2>Fecha de Nacimiento</h2>
            <q-input outlined v-model="birthDate" type="date" label="15-09-2006" class="input" :rules="birthDateRules"
              lazy-rules />
            
            <template v-if="registerRole === 'Estudiante'">
              <q-separator style="margin: 20px 0;" />
              <h2 style="color: #3b82f6; font-weight: bold; margin-bottom: 10px;">Información Adicional (Estudiante)</h2>
              
              <h2>Estrato</h2>
              <q-select outlined v-model="stratum" :options="['1', '2', '3', '4', '5', '6']" label="Opciones"
                class="input" :rules="[val => !!val || 'Debe seleccionar el estrato']" lazy-rules />

              <h2>Grupo de Sisbén</h2>
              <q-select outlined v-model="sisbenGroup"
                :options="['Grupo A', 'Grupo B', 'Grupo C', 'Grupo D', 'No aplica']" label="Seleccione un grupo "
                class="input" :rules="[val => !!val || 'Debe seleccionar grupo de sisbén']" lazy-rules />

              <div class="q-mt-md">
                <div v-if="sisbenGroup === 'Grupo A'">
                  <h2>Subgrupo de Sisbén</h2>
                  <q-select outlined v-model="sisbenSubgroup" :options="['A1', 'A2', 'A3', 'A4', 'A5']"
                    label="Seleccione un subgrupo" class="input"
                    :rules="[val => !!val || 'Debe seleccionar sisbén']" lazy-rules />
                </div>

                <div v-else-if="sisbenGroup === 'Grupo B'">
                  <h2>Subgrupo de Sisbén</h2>
                  <q-select outlined v-model="sisbenSubgroup"
                    :options="['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']" label="Seleccionar un subgrupo"
                    class="input" :rules="[val => !!val || 'Debe seleccionar sisbén']" lazy-rules />
                </div>

                <div v-else-if="sisbenGroup === 'Grupo C'">
                  <h2>Subgrupo de Sisbén</h2>
                  <q-select outlined v-model="sisbenSubgroup"
                    :options="['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18']"
                    label="Seleccione un subgrupo" class="input"
                    :rules="[val => !!val || 'Debe seleccionar sisbén']" lazy-rules />
                </div>

                <div v-else-if="sisbenGroup === 'Grupo D'">
                  <h2>Subgrupo de Sisbén</h2>
                  <q-select outlined v-model="sisbenSubgroup"
                    :options="['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20']"
                    label="Seleccione un subgrupo" class="input"
                    :rules="[val => !!val || 'Debe seleccionar sisbén']" lazy-rules />
                </div>
              </div>

              <h2> EPS</h2>
              <q-select outlined v-model="epsType" :options="['Subsidiado', 'Contributivo', 'No aplica']"
                label="Seleccione un régimen" class="input"
                :rules="[val => !!val || 'Debe seleccionar un régimen']" lazy-rules />

              <div class="q-mt-md">
                <div v-if="epsType === 'Subsidiado'">
                  <h2>Régimen Subsidiado</h2>
                  <q-select outlined v-model="epsName" :options="[
                    'Cajacopi Atlántico',
                    'Capresoca',
                    'Comfachoco',
                    'Comfaoriente',
                    'EPS Familiar de Colombia',
                    'Asmet Salud',
                    'Emssanar E.S.S.',
                    'Capital Salud EPS-S',
                    'Savia Salud EPS',
                    'Dusakawi EPSI',
                    'Asociación Indigena del Cauca EPSI',
                    'Anas Wayuu EPSI',
                    'Mallamas EPSI',
                    'Pijaos Salud EPSI',
                    'Coosalud EPS-S',
                    'Nueva EPS',
                    'Mutual SER',
                    'Salud Mia',
                  ]" label="Seleccione EPS a la que pertenece" class="input"
                    :rules="[val => !!val || 'Debe seleccionar EPS']" lazy-rules />
                </div>

                <div v-else-if="epsType === 'Contributivo'">
                  <h2>Régimen Contributivo</h2>
                  <q-select outlined v-model="epsName" :options="[
                    'Aliansalud EPS',
                    'Salud Total EPS S.A',
                    'EPS Sanitas',
                    'EPS Sura',
                    'Famisanar',
                    'Servicio Occidental De Salud EPS SOS',
                    'Comfenalco Valle',
                    'Compensar EPS',
                    'EPM - Empresas Públicas De Medellín',
                    'Fondo De Pasivo Social De Ferrocarriles Nacionales De Colombia',
                    'Coosalud EPS-S',
                    'Nueva EPS',
                    'Mutual SER',
                    'Salud Mia',
                  ]" label="Seleccionar EPS a la que pertecene" class="input"
                    :rules="[val => !!val || 'Debe seleccionar EPS']" lazy-rules />
                </div>
              </div>

              <h2>Tipo de Sangre</h2>
              <q-select outlined v-model="bloodType"
                :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']" label="Opciones" class="input"
                :rules="[val => !!val || 'Debe seleccionar el tipo de sangre']" lazy-rules />

              <h2>Población Víctima</h2>
              <q-select outlined v-model="victimPopulation" :options="[
                'Desplazamiento forzado',
                'Homicidio',
                'Desaparición forzada',
                'Secuestro',
                'Tortura',
                'Delitos contra la libertad e integridad sexual',
                'Reclutamiento forzado de menores',
                'Mina antipersonal, munición sin explotar o artefacto explosivo improvisado',
                'Lesiones personales o atentado',
                'Amenaza',
                'Despojo o abandono forzado de tierras',
                'Extorsión',
                'Pérdida de bienes muebles o inmuebles',
                'Atentados terroristas o combates',
                'Vinculación a grupos armados ilegales',
                'Otro hecho victimizante',
                'No aplica'
              ]" label="Opciones" :rules="[val => !!val || 'Debe seleccionar población víctima']" lazy-rules />

              <h2>Etnia</h2>
              <q-select outlined v-model="ethnicity" :options="[
                'Indígena',
                'Afrocolombiano(a) o Negro(a)',
                'Raizal del Archipiélago de San Andrés y Providencia',
                'Palenquero(a) de San Basilio',
                'ROM o Gitano(a)',
                'Ninguno'
              ]" label="Opciones" :rules="[val => !!val || 'Debe seleccionar etnia']" lazy-rules />

              <h2>Discapacidad</h2>
              <q-select outlined v-model="disability" :options="[
                'Ninguna',
                'Visual',
                'Auditiva',
                'Física o motora',
                'Intelectual o cognitiva',
                'Psicosocial (mental o emocional)'
              ]" label="Opciones" :rules="[val => !!val || 'Debe seleccionar la discapacidad que presente']"
                lazy-rules />
            </template>
            <Button :loading="loadingRegister" color="primary" label="Crear Cuenta" type="submit"
              style="width: 100%; border-radius: 5px; margin-top: 10px; margin-bottom: 20px;" />
            <p v-if="registerErrorMsg" class="error-msg">{{ registerErrorMsg }}</p>
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
import { useNotify } from "../composables/useNotify.js";
import api from "../services/api.js";


const router = useRouter();
const auth = useAuthStore();
const { showNotify, showErrorNotify } = useNotify();


// --- Login Variables ---
const email = ref("");
const password = ref("");
const role = ref("");
const year = ref("");
const loginErrorMsg = ref(""); 
const loading = ref(false);

// --- Register Variables ---
const isRegisterModalOpen = ref(false); 
const firstName = ref(""); 
const lastName = ref(""); 
const documentType = ref(""); 
const documentNumber = ref(""); 
const registerEmail = ref("");
const registerPassword = ref("");
const confirmPassword = ref("");
const phoneNumber = ref(""); 
const address = ref(""); 
const birthDate = ref(""); 
// Campos solo para Estudiante
const stratum = ref(""); 
const sisbenGroup = ref(''); 
const sisbenSubgroup = ref('');
const epsType = ref(""); 
const epsName = ref(""); 
const bloodType = ref("");
const victimPopulation = ref(""); 
const ethnicity = ref(""); 
const disability = ref(""); 
const registerRole = ref(""); // Clave para la lógica condicional
const loadingRegister = ref(false);
const registerErrorMsg = ref(""); 

// --- Validation Rules (Se mantienen como antes) ---
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

const confirmPasswordRules = [
 val => !!val || "Debe confirmar la contraseña",
 val => val === registerPassword.value || "Las contraseñas no coinciden"
];

const nameRules = [
 val => !!val || "Este campo es obligatorio",
 val => val.length >= 2 || "Debe tener al menos 2 caracteres",
 val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val) || "Solo se permiten letras y espacios"
];

const documentNumberRules = [
 val => !!val || "El número de documento es obligatorio",
 val => /^\d{5,15}$/.test(val) || "Ingrese un número de documento válido"
];

const phoneNumberRules = [
 val => !!val || "El número de teléfono es obligatorio",
 val => /^\d{7,10}$/.test(val) || "Ingrese un número de teléfono válido "
];

const addressRules = [
 val => !!val || "La dirección es obligatoria",
 val => val.length >= 5 || "La dirección es demasiado corta"
];

const birthDateRules = [
 val => !!val || "La fecha de nacimiento es obligatoria",
 val => {
 const today = new Date();
 const birth = new Date(val);
 let age = today.getFullYear() - birth.getFullYear();
 const m = today.getMonth() - birth.getMonth();
 if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
 age--;
 }
 return age >= 5 || "Debe ingresar la fecha de nacimiento ";
 }
];

const isRecoverModalOpen = ref(false);
const recoverEmail = ref("");
const recoverMsg = ref("");
const loadingRecover = ref(false);

const handleRecoverPassword = async () => {
  recoverMsg.value = "";
  loadingRecover.value = true;
  try {
    const response = await fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: recoverEmail.value }),
    });

    const data = await response.json();
    if (response.ok) {
      showNotify("📩 Se ha enviado un correo para restablecer la contraseña.", "positive");
      isRecoverModalOpen.value = false;
    } else {
      showErrorNotify(data.message || "Error al enviar el correo.");
    }
  } catch (err) {
    showErrorNotify("❌ Error de conexión al servidor.");
  } finally {
    setTimeout(() => (loadingRecover.value = false), 500);
  }
};

const handleLogin = async () => { 
loginErrorMsg.value = "";
loading.value = true;

try {
await fetch("http://localhost:3000/api/usuarios-colegio/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();

if (response.ok) {
// ⚠️ Usamos la acción 'loginBackend' del store para guardar el JWT y la info.
auth.loginBackend(email.value, data.token, data.role); 

showNotify('✅ ¡Inicio de sesión exitoso! Redirigiendo...', 'positive');

// Redirigimos a la ruta protegida (Home)
setTimeout(() => {
 router.push("/home"); // Asegúrate de que esta ruta sea correcta según tu router
}, 500); 
} else {
// Manejo de errores del backend
const msg = data.message || "Error desconocido al iniciar sesión.";
loginErrorMsg.value = msg;
showErrorNotify(msg);
}
} catch (err) {
// Error de conexión
const msg = "❌ Error de conexión. Asegúrate de que el servidor esté encendido.";
loginErrorMsg.value = msg;
showErrorNotify(msg);
} finally {
// Reducimos el tiempo de espera para que sea más rápido
setTimeout(() => {
  loading.value = false;
}, 500); 
}
};

// --- Login Function (Se mantiene como antes) ---
// const handleLogin = async () => { 
//  loginErrorMsg.value = "";
//  loading.value = true;

// try {
//  const response = await fetch("http://localhost:3000/login", {
//  method: "POST",
//  headers: { "Content-Type": "application/json" },
//  body: JSON.stringify({
//  email: email.value,
//  password: password.value,
//  role: role.value,
//  year: Number(year.value)
//  }),
//  });

//  const data = await response.json();

//  if (response.ok) {
//  auth.user = { email: email.value, role: role.value };
//  auth.token = data.token || "fakeToken";
//  localStorage.setItem("user", JSON.stringify(auth.user));
//  localStorage.setItem("token", auth.token);
//  setTimeout(() => {
//  router.push("/dashboard");
//  }, 1500);
//  } else {
//  loginErrorMsg.value = data.message || "Error desconocido al iniciar sesión.";
//  }
//  } catch (err) {
//  loginErrorMsg.value =
//  "Error de conexión. Asegúrate de que el servidor esté encendido.";
//  } finally {
//  setTimeout(() => {
//  loading.value = false;
//  }, 3000);
//  }
// };


// const handleRegister = async () => {
//  registerErrorMsg.value = "";
//  loadingRegister.value = true;

// const finalSisben = sisbenGroup.value === 'No aplica' ? 'No aplica' : `${sisbenGroup.value} - ${sisbenSubgroup.value}`;
// const finalEps = epsType.value === 'No aplica' ? 'No aplica' : `${epsType.value} - ${epsName.value}`;

//  const registrationData = {
//  role: registerRole.value,
//  firstName: firstName.value,
//  lastName: lastName.value,
//  documentType: documentType.value,
//  documentNumber: documentNumber.value,
//  email: registerEmail.value,
//  password: registerPassword.value,
//  phoneNumber: phoneNumber.value,
//  address: address.value,
//  birthDate: birthDate.value,
//  };

//  if (registerRole.value === 'Estudiante') {
//  registrationData.stratum = stratum.value;
//  registrationData.sisben = sisbenGroup.value === 'No aplica' ? 'No aplica' : `${sisbenGroup.value} - ${sisbenSubgroup.value}`;
//  registrationData.eps = epsType.value === 'No aplica' ? 'No aplica' : `${epsType.value} - ${epsName.value}`;
//  registrationData.bloodType = bloodType.value;
//  registrationData.victimPopulation = victimPopulation.value;
//  registrationData.ethnicity = ethnicity.value;
//  registrationData.disability = disability.value;
//  }

//  try {
//  const response = await fetch("http://localhost:3000/register", {
//  method: "POST",
//  headers: { "Content-Type": "application/json" },
//  body: JSON.stringify(registrationData),
//  });

//  const data = await response.json();

//  if (response.ok) {
//  alert("Registro exitoso. ¡Inicie sesión ahora!");
//  isRegisterModalOpen.value = false;
//  } else {
//  registerErrorMsg.value = data.message || "Error desconocido al registrar la cuenta.";
//  }
//  } catch (err) {
//  registerErrorMsg.value =
//  "Error de conexión. Asegúrate de que el servidor esté encendido para registrarte.";
//  } finally {
//  setTimeout(() => {
//  loadingRegister.value = false;
//  }, 3000);
//  }
// };

const handleRegister = async () => {
  registerErrorMsg.value = "";
  loadingRegister.value = true;

  const registrationData = {
    role: registerRole.value,
    firstName: firstName.value,
    lastName: lastName.value,
    documentType: documentType.value,
    documentNumber: documentNumber.value,
    email: registerEmail.value,
    password: registerPassword.value,
    phoneNumber: phoneNumber.value,
    address: address.value,
    birthDate: birthDate.value,
  };

  try {
    await fetch("http://localhost:3000/api/usuarios-colegio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosDelUsuario),
  });


    const data = await response.json();

    if (response.ok) {
      showNotify("✅ ¡Registro exitoso!", "positive");
      isRegisterModalOpen.value = false;
    } else {
      const msg = data.message || "Error al registrar usuario.";
      registerErrorMsg.value = msg;
      showErrorNotify(msg);
    }
  } catch (err) {
    const msg = "❌ Error de conexión con el servidor.";
    registerErrorMsg.value = msg;
    showErrorNotify(msg);
  } finally {
    loadingRegister.value = false;
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