<template>
  <div v-if="auth.user" class="guardian-profile q-pa-lg">
    <!-- Título principal -->
    <div class="text-h5 text-bold q-mb-lg">My Profile</div>

    <!-- Contenedor principal -->
    <div class="profile-content row q-col-gutter-lg">
      <!-- Lado izquierdo -->
      <div class="col-12 col-md-4">
        <!-- Tarjeta de foto y nombre -->
        <q-card class="q-pa-md q-mb-md flex flex-center column text-center">
          <q-avatar size="120px" class="q-mb-md">
            <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Profile photo" />
          </q-avatar>
          <div class="text-subtitle1 text-bold">
            {{ auth.user?.firstName }} {{ auth.user?.lastName }}
          </div>
        </q-card>

        <!-- Información personal -->
        <q-card class="q-pa-md">
          <div class="text-subtitle1 text-bold q-mb-md">Informacion Personal</div>
          <q-separator />

          <div class="q-mt-md">
            <div class="row items-center q-mb-sm">
              <div class="col-4 text-grey">Email:</div>
              <div class="col">{{ auth.user?.email }}</div>
            </div>
            <div class="row items-center q-mb-sm">
              <div class="col-4 text-grey">Role:</div>
              <div class="col">{{ auth.userRole }}</div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Lado derecho -->
      <div class="col-12 col-md-8">
        <q-card class="q-pa-lg">
          <!-- Sección cambiar contraseña -->
          <div class="text-subtitle1 text-bold q-mb-sm">Cambiar Contraseña</div>
          <div class="text-body2 text-grey q-mb-md">
            Actualiza tu contraseña
          </div>

          <q-form @submit.prevent="saveChanges">
            <div class="q-gutter-md">
              <div>
                <label class="text-grey-8 text-caption">Contraseña</label>
                <q-input v-model="form.currentPassword" type="password" filled />
              </div>

              <div>
                <label class="text-grey-8 text-caption">Nueva Contraseña</label>
                <q-input v-model="form.newPassword" type="password" filled />
              </div>

              <div>
                <label class="text-grey-8 text-caption">Confirmar Nueva Contraseña</label>
                <q-input v-model="form.confirmPassword" type="password" filled />
              </div>
            </div>

            <!-- Botones -->
            <div class="row justify-end q-mt-lg q-gutter-sm">
              <q-btn
                flat
                color="grey-7"
                label="Cancelar"
                @click="cancel"
              />
              <q-btn
                color="primary"
                label="Guardar Cambios"
                type="submit"
              />
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import api from '../../services/api'

const auth = useAuthStore()

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function saveChanges() {
  if (form.newPassword !== form.confirmPassword) {
    // Manejar error de contraseñas no coincidentes
    return
  }

  try {
    await api.put(
      `/users/change-password/${auth.user._id}`,
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }
    )
    // Manejar éxito
    cancel()
  } catch (error) {
    // Manejar error
    console.error('Error al cambiar la contraseña:', error)
  }
}

function cancel() {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}
</script>

<style scoped>
.guardian-profile {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  border-radius: 12px;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }
}
</style>