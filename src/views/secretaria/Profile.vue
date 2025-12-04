<template>
  <q-page class="page-container">
    <div v-if="loading" class="loading-spinner">
      <q-spinner-dots color="primary" size="50px" />
      <p>Cargando perfil...</p>
    </div>
    <div v-if="error" class="error-message">
      <q-icon name="warning" color="negative" size="50px" />
      <p>Error al cargar el perfil: {{ error }}</p>
    </div>

    <div v-if="!loading && !error" class="profile-container">
      <!-- Profile Header -->
      <q-card class="profile-header-card">
        <q-card-section class="profile-header">
          <q-avatar size="120px">
            <img :src="profile.profilePhoto || 'https://cdn.quasar.dev/img/boy-avatar.png'" alt="Foto de Perfil">
          </q-avatar>
          <div class="profile-info">
            <h4 class="profile-name">{{ profile.names }} {{ profile.lastNames }}</h4>
            <p class="profile-role">{{ profile.roles }}</p>
            <p class="profile-email">{{ profile.email }}</p>
          </div>
          <q-btn flat round icon="photo_camera" @click="changePhoto" class="change-photo-btn" />
        </q-card-section>
      </q-card>

      <!-- Main Content Grid -->
      <div class="profile-grid">
        <!-- Personal Information -->
        <q-card class="grid-card">
          <q-card-section>
            <h5 class="section-header">Información Personal</h5>
            <div class="info-grid">
              <div><strong>Documento:</strong> {{ profile.typeDocument }} {{ profile.numberDocument }}</div>
              <div><strong>Teléfono:</strong> {{ profile.cellphone }}</div>
              <div><strong>Dirección:</strong> {{ profile.direction }}</div>
              <div><strong>Fecha de Nacimiento:</strong> {{ profile.dateBorn }}</div>
              <div><strong>Género:</strong> {{ profile.gender }}</div>
              <div><strong>Estrato:</strong> {{ profile.stratum }}</div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Management Actions -->
        <q-card class="grid-card">
          <q-card-section>
            <h5 class="section-header">Acciones de Gestión</h5>
            <div class="management-actions">
              <q-btn to="/secretaria/headquarters" label="Gestión de Sedes" color="primary" icon="business" class="q-mr-md q-mb-md" />
              <q-btn to="/secretaria/matriculas" label="Gestión de Matrículas" color="secondary" icon="assignment" class="q-mb-md" />
            </div>
          </q-card-section>
        </q-card>

        <!-- Digital Signature -->
        <q-card class="grid-card">
          <q-card-section>
            <h5 class="section-header">Firma Digital</h5>
            <div class="signature-section">
              <div class="signature-preview">
                <img v-if="profile.signDigital" :src="profile.signDigital" alt="Firma Digital">
                <div v-else class="signature-placeholder">
                  <q-icon name="image" size="40px" />
                  <p>No hay firma digital</p>
                </div>
              </div>
              <q-btn label="Cambiar Firma" color="secondary" @click="changeSignature" class="q-mt-md" />
            </div>
          </q-card-section>
        </q-card>

        <!-- Change Password -->
        <q-card class="grid-card">
          <q-card-section>
            <h5 class="section-header">Cambiar Contraseña</h5>
            <div class="password-form">
              <q-input v-model="password.new" type="password" label="Nueva Contraseña" outlined dense />
              <q-input v-model="password.confirm" type="password" label="Confirmar Contraseña" outlined dense />

              <div class="password-strength-indicator">
                <div class="strength-bar" :class="passwordStrengthClass"></div>
                <span class="strength-text">{{ passwordStrengthText }}</span>
              </div>

              <q-btn label="Actualizar Contraseña" color="primary" @click="changePassword" class="q-mt-md" />

              <div class="password-tips" v-if="showPasswordTips">
                <p><strong>Consejos para una contraseña segura:</strong></p>
                <ul>
                  <li>Usa al menos 8 caracteres.</li>
                  <li>Combina letras mayúsculas, minúsculas, números y símbolos.</li>
                  <li>No uses información personal fácil de adivinar.</li>
                </ul>
              </div>
              <q-btn flat dense label="Mostrar consejos" @click="showPasswordTips = !showPasswordTips" size="sm" class="tips-toggle" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';
import { getData, postData } from '@/services/httpService';

export default {
  name: 'SecretariaProfile',
  setup() {
    const route = useRoute();
    const $q = useQuasar();
    const authStore = useAuthStore();

    const profile = ref({});
    const password = ref({ new: '', confirm: '' });
    const showPasswordTips = ref(false);
    const loading = ref(true);
    const error = ref(null);

    const passwordStrength = computed(() => {
      const p = password.value.new;
      let score = 0;
      if (!p) return 0;
      if (p.length >= 8) score++;
      if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
      if (/\d/.test(p)) score++;
      if (/[^a-zA-Z0-9]/.test(p)) score++;
      return score;
    });

    const passwordStrengthText = computed(() => {
      const score = passwordStrength.value;
      if (score <= 1) return 'Débil';
      if (score <= 3) return 'Media';
      return 'Fuerte';
    });

    const passwordStrengthClass = computed(() => {
      const score = passwordStrength.value;
      if (score <= 1) return 'strength-weak';
      if (score <= 3) return 'strength-medium';
      return 'strength-strong';
    });

    const changePhoto = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = handlePhotoChange;
      input.click();
    };

    const handlePhotoChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        uploadPhoto(base64String);
      };
      reader.readAsDataURL(file);
    };

    const uploadPhoto = async (photo) => {
      try {
        const response = await postData(`/users/${authStore.user.id}/photo`, { photo });
        profile.value.profilePhoto = photo;
        $q.notify({ type: 'positive', message: response.message || 'Foto de perfil actualizada.' });
      } catch (err) {
        $q.notify({ type: 'negative', message: `Error al actualizar la foto: ${err.message}` });
      }
    };

    const changeSignature = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = handleFileChange;
      input.click();
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        uploadSignature(base64String);
      };
      reader.readAsDataURL(file);
    };

    const uploadSignature = async (signature) => {
      try {
        const response = await postData(`/users/${authStore.user.id}/signature`, { signature });
        profile.value.signDigital = signature;
        $q.notify({ type: 'positive', message: response.message || 'Firma actualizada correctamente.' });
      } catch (err) {
        $q.notify({ type: 'negative', message: `Error al actualizar la firma: ${err.message}` });
      }
    };

    const resetPasswordForm = () => {
      password.value.new = '';
      password.value.confirm = '';
    };

    const changePassword = async () => {
      if (password.value.new !== password.value.confirm) {
        return $q.notify({ type: 'negative', message: 'Las contraseñas no coinciden.' });
      }
      if (password.value.new.length < 8) {
        return $q.notify({ type: 'negative', message: 'La contraseña debe tener al menos 8 caracteres.' });
      }
      try {
        const response = await postData(`/users/${authStore.user.id}/change-password`, { newPassword: password.value.new });
        $q.notify({ type: 'positive', message: response.message || 'Contraseña actualizada' });
        resetPasswordForm();
      } catch (err) {
        $q.notify({ type: 'negative', message: `Error: ${err.message}` });
      }
    };

    const fetchProfileData = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await getData(`/users/${authStore.user.id}`);
        profile.value = response;
        authStore.updateUser(response); // Actualiza el store con los nuevos datos
      } catch (err) {
        error.value = err.message;
        $q.notify({ type: 'negative', message: `No se pudo cargar el perfil: ${err.message}` });
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      if (authStore.user && authStore.user.id) {
        fetchProfileData();
      } else {
        error.value = "No se ha encontrado el ID del usuario.";
        loading.value = false;
      }
    });

    return {
      profile, password, showPasswordTips, loading, error,
      passwordStrengthClass, passwordStrengthText,
      changePhoto, changeSignature, changePassword,
    };
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  background-color: #f0f2f5;
}

.loading-spinner,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  gap: 16px;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header-card {
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  position: relative;
}

.profile-info {
  .profile-name {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }
  .profile-role, .profile-email {
    font-size: 1rem;
    color: #555;
    margin: 4px 0 0;
  }
}

.change-photo-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.grid-card {
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
}

.section-header {
  font-size: 1.4rem;
  font-weight: 500;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  font-size: 0.95rem;
}

.management-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.signature-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signature-preview {
  width: 100%;
  max-width: 300px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.signature-placeholder {
  text-align: center;
  color: #888;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.password-strength-indicator {
  width: 100%;
  .strength-bar {
    height: 8px;
    border-radius: 4px;
    transition: all 0.3s;
    background-color: #eee;
  }
  .strength-weak { width: 25%; background-color: #e74c3c; }
  .strength-medium { width: 60%; background-color: #f39c12; }
  .strength-strong { width: 100%; background-color: #2ecc71; }
  .strength-text {
    font-size: 0.8rem;
    text-align: right;
    margin-top: 4px;
    color: #555;
  }
}

.password-tips {
  font-size: 0.85rem;
  color: #666;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 4px;
}

.tips-toggle {
  align-self: flex-start;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>