<template>
  <div class="containerRegister">
    <div class="header">
      <h1>Bienvenido</h1>
      <p class="subtitle">Regístrese para continuar</p>
    </div>

    <q-form @submit.prevent="handleRegister" class="form">
        <!-- Sección: Rol -->
        <div class="form-section">
          <h3 class="section-title">Información de Rol</h3>
          <div class="input-group">
            <label class="input-label">Selecciona tu rol *</label>
            <q-select 
              outlined 
              v-model="registerRole"
              :options="['Administrador', 'Rector', 'Coordinador', 'Acudiente', 'Estudiante', 'Profesor']"
              class="input" 
              :rules="[val => !!val || 'Debe seleccionar un rol']" 
              lazy-rules 
            />
          </div>
        </div>

        <!-- Sección: Información Personal -->
        <div class="form-section">
          <h3 class="section-title">Información Personal</h3>
          
          <div class="input-row">
            <div class="input-group half">
              <label class="input-label">Nombres *</label>
              <q-input 
                outlined 
                v-model="firstName" 
                placeholder="Sayury Yuliana" 
                class="input" 
                :rules="nameRules" 
                lazy-rules 
              />
            </div>
            
            <div class="input-group half">
              <label class="input-label">Apellidos *</label>
              <q-input 
                outlined 
                v-model="lastName" 
                placeholder="Rodríguez Pinzón" 
                class="input" 
                :rules="nameRules" 
                lazy-rules 
              />
            </div>
          </div>

          <div class="input-row">
            <div class="input-group half">
              <label class="input-label">Tipo de Documento *</label>
              <q-select 
                outlined 
                v-model="documentType"
                :options="['Tarjeta de Identidad', 'Cédula de Ciudadanía', 'Cédula de Extranjería']" 
                class="input" 
                :rules="[val => !!val || 'Debe seleccionar el tipo de documento']" 
                lazy-rules 
              />
            </div>
            
            <div class="input-group half">
              <label class="input-label">Número de Documento *</label>
              <q-input 
                outlined 
                v-model="documentNumber" 
                placeholder="1095510403" 
                class="input" 
                type="number"
                :rules="documentNumberRules" 
                lazy-rules 
              />
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">Fecha de Nacimiento *</label>
            <q-input 
              outlined 
              v-model="birthDate" 
              type="date" 
              class="input" 
              :rules="birthDateRules"
              lazy-rules 
            />
          </div>
        </div>

        <!-- Sección: Información de Contacto -->
        <div class="form-section">
          <h3 class="section-title">Información de Contacto</h3>
          
          <div class="input-group">
            <label class="input-label">Correo electrónico *</label>
            <q-input 
              outlined 
              v-model="registerEmail" 
              placeholder="usuario@gmail.com" 
              class="input" 
              type="email"
              :rules="emailRules" 
              lazy-rules 
            />
          </div>

          <div class="input-group">
            <label class="input-label">Número de Teléfono *</label>
            <q-input 
              outlined 
              v-model="phoneNumber" 
              type="tel" 
              placeholder="3123460633" 
              class="input"
              :rules="phoneNumberRules" 
              lazy-rules 
            />
          </div>

          <div class="input-group">
            <label class="input-label">Dirección *</label>
            <q-input 
              outlined 
              v-model="address" 
              type="text" 
              placeholder="Calle 28 6-35" 
              class="input" 
              :rules="addressRules"
              lazy-rules 
            />
          </div>
        </div>

        <!-- Sección: Seguridad -->
        <div class="form-section">
          <h3 class="section-title">Seguridad</h3>
          
          <div class="input-group">
            <label class="input-label">Contraseña *</label>
            <q-input 
              outlined 
              v-model="registerPassword" 
              type="password" 
              placeholder="Ingrese su contraseña" 
              class="input"
              :rules="passwordRules" 
              lazy-rules 
            />
          </div>

          <div class="input-group">
            <label class="input-label">Confirmar Contraseña *</label>
            <q-input 
              outlined 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Confirme su contraseña" 
              class="input"
              :rules="confirmPasswordRules" 
              lazy-rules 
            />
          </div>
        </div>

        <!-- Información adicional para Estudiantes -->
        <template v-if="registerRole === 'Estudiante'">
          <div class="form-section student-section">
            <h3 class="section-title-special">
              <q-icon name="school" size="24px" style="margin-right: 8px;" />
              Información Adicional del Estudiante
            </h3>
            
            <!-- Información Socioeconómica -->
            <div class="subsection">
              <h4 class="subsection-title">Información Socioeconómica</h4>
              
              <div class="input-row">
                <div class="input-group half">
                  <label class="input-label">Estrato *</label>
                  <q-select 
                    outlined 
                    v-model="stratum" 
                    :options="['1', '2', '3', '4', '5', '6']" 
                    class="input" 
                    :rules="[val => !!val || 'Debe seleccionar el estrato']" 
                    lazy-rules 
                  />
                </div>
                
                <div class="input-group half">
                  <label class="input-label">Grupo de Sisbén *</label>
                  <q-select 
                    outlined 
                    v-model="sisbenGroup"
                    :options="['Grupo A', 'Grupo B', 'Grupo C', 'Grupo D', 'No aplica']" 
                    class="input" 
                    :rules="[val => !!val || 'Debe seleccionar grupo de sisbén']" 
                    lazy-rules 
                  />
                </div>
              </div>

              <div class="input-group" v-if="sisbenGroup && sisbenGroup !== 'No aplica'">
                <label class="input-label">Subgrupo de Sisbén *</label>
                <q-select 
                  outlined 
                  v-model="sisbenSubgroup" 
                  :options="getSisbenSubgroupOptions()"
                  class="input"
                  :rules="[val => !!val || 'Debe seleccionar sisbén']" 
                  lazy-rules 
                />
              </div>
            </div>

            <!-- Información de Salud -->
            <div class="subsection">
              <h4 class="subsection-title">Información de Salud</h4>
              
              <div class="input-row">
                <div class="input-group half">
                  <label class="input-label">Régimen EPS *</label>
                  <q-select 
                    outlined 
                    v-model="epsType" 
                    :options="['Subsidiado', 'Contributivo', 'No aplica']"
                    class="input"
                    :rules="[val => !!val || 'Debe seleccionar un régimen']" 
                    lazy-rules 
                  />
                </div>
                
                <div class="input-group half">
                  <label class="input-label">Tipo de Sangre *</label>
                  <q-select 
                    outlined 
                    v-model="bloodType"
                    :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']" 
                    class="input"
                    :rules="[val => !!val || 'Debe seleccionar el tipo de sangre']" 
                    lazy-rules 
                  />
                </div>
              </div>

              <div class="input-group" v-if="epsType && epsType !== 'No aplica'">
                <label class="input-label">EPS *</label>
                <q-select 
                  outlined 
                  v-model="epsName" 
                  :options="getEpsOptions()"
                  class="input"
                  :rules="[val => !!val || 'Debe seleccionar EPS']" 
                  lazy-rules 
                />
              </div>
            </div>

            <!-- Información de Población -->
            <div class="subsection">
              <h4 class="subsection-title">Información de Población</h4>
              
              <div class="input-group">
                <label class="input-label">Población Víctima *</label>
                <q-select 
                  outlined 
                  v-model="victimPopulation" 
                  :options="[
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
                  ]" 
                  class="input" 
                  :rules="[val => !!val || 'Debe seleccionar población víctima']" 
                  lazy-rules 
                />
              </div>

              <div class="input-group">
                <label class="input-label">Etnia *</label>
                <q-select 
                  outlined 
                  v-model="ethnicity" 
                  :options="[
                    'Indígena',
                    'Afrocolombiano(a) o Negro(a)',
                    'Raizal del Archipiélago de San Andrés y Providencia',
                    'Palenquero(a) de San Basilio',
                    'ROM o Gitano(a)',
                    'Ninguno'
                  ]" 
                  class="input" 
                  :rules="[val => !!val || 'Debe seleccionar etnia']" 
                  lazy-rules 
                />
              </div>

              <div class="input-group">
                <label class="input-label">Discapacidad *</label>
                <q-select 
                  outlined 
                  v-model="disability" 
                  :options="[
                    'Ninguna',
                    'Visual',
                    'Auditiva',
                    'Física o motora',
                    'Intelectual o cognitiva',
                    'Psicosocial (mental o emocional)'
                  ]" 
                  class="input" 
                  :rules="[val => !!val || 'Debe seleccionar la discapacidad que presente']"
                  lazy-rules 
                />
              </div>
            </div>
          </div>
        </template>

        <div class="button-group">
          <Button 
            :loading="loadingRegister" 
            color="primary" 
            label="Crear Cuenta" 
            type="submit"
            class="submit-btn"
          />
        </div>

        <p style="text-align: center; margin-top: 16px;">
          ¿Ya tienes cuenta? <router-link to="/">Inicia sesión aquí</router-link>
        </p>
        
        <p v-if="registerErrorMsg" class="error-msg">{{ registerErrorMsg }}</p>
      </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../components/Button.vue'
import axios from 'axios'

const router = useRouter()

// variables para el modal de registro
const registerRole = ref('Estudiante')
const firstName = ref('')
const lastName = ref('')
const documentType = ref('Cédula de Ciudadanía')
const documentNumber = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const confirmPassword = ref('')
const phoneNumber = ref('')
const address = ref('')
const birthDate = ref('')
const stratum = ref('')
const sisbenGroup = ref('')
const sisbenSubgroup = ref('')
const epsType = ref('')
const epsName = ref('')
const bloodType = ref('')
const victimPopulation = ref('')
const ethnicity = ref('')
const disability = ref('')
const registerErrorMsg = ref('')
const loadingRegister = ref(false)

// Funciones auxiliares
const getSisbenSubgroupOptions = () => {
  const options = {
    'Grupo A': ['A1', 'A2', 'A3', 'A4', 'A5'],
    'Grupo B': ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
    'Grupo C': ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18'],
    'Grupo D': ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20']
  }
  return options[sisbenGroup.value] || []
}

const getEpsOptions = () => {
  const subsidiado = [
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
    'Salud Mia'
  ]
  
  const contributivo = [
    'Aliansalud EPS',
    'Salud Total EPS S.A',
    'EPS Sanitas',
    'EPS Sura',
    'Famisanar',
    'Servicio Occidental De Salud EPS SOS',
    'Comfenalco Valle',
    'Compensar EPS',
    'EPM - Empresas Públicas De Medellín',
    'Fondo De Pasivo Social de Ferrocarriles Nacionales De Colombia',
    'Coosalud EPS-S',
    'Nueva EPS',
    'Mutual SER',
    'Salud Mia'
  ]
  
  return epsType.value === 'Subsidiado' ? subsidiado : contributivo
}

// Reglas de validación
const emailRules = [
  (val) => !!val || 'El correo es obligatorio',
  (val) => /.+@.+\..+/.test(val) || 'Ingrese un correo electrónico válido'
]
const passwordRules = [
  (val) => !!val || 'La contraseña es obligatoria',
  (val) => val.length >= 8 || 'Debe tener al menos 8 caracteres'
]
const confirmPasswordRules = [
  (val) => !!val || 'Debe confirmar la contraseña',
  (val) => val === registerPassword.value || 'Las contraseñas no coinciden'
]
const nameRules = [
  (val) => !!val || 'Este campo es obligatorio',
  (val) => val.length >= 2 || 'Debe tener al menos 2 caracteres'
]
const documentNumberRules = [
  (val) => !!val || 'El número de documento es obligatorio',
  (val) => /^\d{5,15}$/.test(val) || 'Ingrese un número de documento válido'
]
const phoneNumberRules = [
  (val) => !!val || 'El número de teléfono es obligatorio',
  (val) => /^\d{7,10}$/.test(val) || 'Ingrese un número de teléfono válido'
]
const addressRules = [
  (val) => !!val || 'La dirección es obligatoria',
  (val) => val.length >= 5 || 'La dirección es demasiado corta'
]
const birthDateRules = [
  (val) => !!val || 'La fecha de nacimiento es obligatoria'
]

// Lógica para el registro
 const handleRegister = async () => { 
   loadingRegister.value = true 
   registerErrorMsg.value = '' 
 
   if (registerPassword.value !== confirmPassword.value) { 
     registerErrorMsg.value = 'Las contraseñas no coinciden' 
     loadingRegister.value = false 
     return 
   } 
 
   // Construir el objeto de datos según lo que espera el backend 
   const registrationData = { 
     firstName: firstName.value, 
     lastName: lastName.value, 
     documentType: documentType.value, 
     documentNumber: documentNumber.value, 
     email: registerEmail.value, 
     password: registerPassword.value, 
     phoneNumber: phoneNumber.value, 
     address: address.value, 
     birthDate: birthDate.value, 
     roles: [registerRole.value] 
   } 
 
   // Si es estudiante, agregar datos adicionales 
   if (registerRole.value === 'Estudiante') { 
     registrationData.studentInfo = { 
       stratum: stratum.value, 
       sisbenGroup: sisbenGroup.value, 
       sisbenSubgroup: sisbenSubgroup.value, 
       epsType: epsType.value, 
       epsName: epsName.value, 
       bloodType: bloodType.value, 
       victimPopulation: victimPopulation.value, 
       ethnicity: ethnicity.value, 
       disability: disability.value 
     } 
   } 
 
   try { 
     // El endpoint correcto es /api/usuarios-colegio 
     await axios.post('http://localhost:3000/api/usuarios-colegio', registrationData) 
     router.push('/') 
   } catch (error) { 
     if (error.response) { 
       registerErrorMsg.value = error.response.data.message || 'Error en el registro' 
     } else { 
       registerErrorMsg.value = 'Error de red o el servidor no responde.' 
     } 
   } finally { 
     loadingRegister.value = false 
   } 
 }
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
  margin: 0;
  box-sizing: border-box;
}

.containerRegister {
  background: white;
  min-height: 100vh;
  padding: 40px 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 50px;
  padding-top: 20px;
}

.header h1 {
  font-size: 42px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
}

.form {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.form-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.student-section {
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border: 2px solid #3b82f6;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.section-title-special {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #3b82f6;
  display: flex;
  align-items: center;
}

.subsection {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #cbd5e1;
}

.subsection:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 16px 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group.half {
  flex: 1;
  min-width: 0;
}

.input-row {
  display: flex;
  gap: 16px;
  margin-bottom: 0;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input {
  width: 100%;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  margin-bottom: 16px;
}

.back-btn {
  flex: 1;
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  border: 2px solid #e2e8f0;
}

.submit-btn {
  flex: 1;
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.error-msg {
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin: 16px 0;
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

/* Responsive */
@media (max-width: 768px) {
  .containerRegister {
    padding: 30px 20px;
  }

  .header h1 {
    font-size: 32px;
  }

  .header {
    margin-bottom: 40px;
  }

  .form {
    max-width: 100%;
  }

  .input-row {
    flex-direction: column;
    gap: 0;
  }

  .input-group.half {
    width: 100%;
  }

  .section-title-special {
    font-size: 18px;
  }

  .form-section {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>