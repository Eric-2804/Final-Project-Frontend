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
          <q-avatar size="100px">
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

      <!-- Main Content - Two Columns Layout -->
      <div class="content-wrapper">
        <!-- Left Column -->
        <div class="left-column">
          <!-- Personal Information -->
          <q-card class="info-card">
            <q-card-section>
              <h5 class="section-header">
                <q-icon name="person" class="q-mr-sm" />
                Información Personal
              </h5>
              <div class="info-grid">
                <div class="info-item">
                  <q-icon name="badge" size="20px" color="primary" />
                  <span><strong>Documento:</strong> {{ profile.typeDocument }} {{ profile.numberDocument }}</span>
                </div>
                <div class="info-item">
                  <q-icon name="phone" size="20px" color="primary" />
                  <span><strong>Teléfono:</strong> {{ profile.cellphone }}</span>
                </div>
                <div class="info-item">
                  <q-icon name="home" size="20px" color="primary" />
                  <span><strong>Dirección:</strong> {{ profile.direction }}</span>
                </div>
                <div class="info-item">
                  <q-icon name="cake" size="20px" color="primary" />
                  <span><strong>Fecha de Nacimiento:</strong> {{ profile.dateBorn }}</span>
                </div>
                <div class="info-item">
                  <q-icon name="wc" size="20px" color="primary" />
                  <span><strong>Género:</strong> {{ profile.gender }}</span>
                </div>
                <div class="info-item">
                  <q-icon name="layers" size="20px" color="primary" />
                  <span><strong>Estrato:</strong> {{ profile.stratum }}</span>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Management Actions -->
          <q-card class="info-card">
            <q-card-section>
              <h5 class="section-header">
                <q-icon name="settings" class="q-mr-sm" />
                Acciones de Gestión
              </h5>
              <div class="management-actions">
                <q-btn 
                  to="/secretaria/headquarters" 
                  label="Gestión de Sedes" 
                  color="primary" 
                  icon="business" 
                  unelevated
                  class="action-btn"
                />
                <q-btn 
                  to="/secretaria/matriculas" 
                  label="Gestión de Matrículas" 
                  color="secondary" 
                  icon="assignment"
                  unelevated
                  class="action-btn"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Right Column -->
        <div class="right-column">
          <!-- Digital Signature -->
          <q-card class="info-card">
            <q-card-section>
              <h5 class="section-header">
                <q-icon name="draw" class="q-mr-sm" />
                Firma Digital
              </h5>
              <div class="signature-section">
                <div class="signature-preview">
                  <img v-if="profile.signDigital" :src="profile.signDigital" alt="Firma Digital">
                  <div v-else class="signature-placeholder">
                    <q-icon name="image" size="40px" color="grey-5" />
                    <p>No hay firma digital</p>
                  </div>
                </div>
                <q-btn 
                  label="Cambiar Firma" 
                  color="secondary" 
                  icon="upload" 
                  @click="changeSignature" 
                  unelevated
                  class="q-mt-md full-width"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Change Password -->
          <q-card class="info-card">
            <q-card-section>
              <h5 class="section-header">
                <q-icon name="lock" class="q-mr-sm" />
                Cambiar Contraseña
              </h5>
              <div class="password-form">
                <q-input 
                  v-model="password.current" 
                  type="password" 
                  label="Contraseña Actual" 
                  outlined 
                  dense
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="vpn_key" />
                  </template>
                </q-input>

                <q-input 
                  v-model="password.new" 
                  type="password" 
                  label="Nueva Contraseña" 
                  outlined 
                  dense
                  :rules="[val => val.length >= 8 || 'Mínimo 8 caracteres']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                </q-input>

                <q-input 
                  v-model="password.confirm" 
                  type="password" 
                  label="Confirmar Contraseña" 
                  outlined 
                  dense
                  :rules="[val => val === password.new || 'Las contraseñas no coinciden']"
                >
                  <template v-slot:prepend>
                    <q-icon name="check_circle" />
                  </template>
                </q-input>

                <div class="password-strength-indicator" v-if="password.new">
                  <div class="strength-bar-container">
                    <div class="strength-bar" :class="passwordStrengthClass"></div>
                  </div>
                  <span class="strength-text">Seguridad: {{ passwordStrengthText }}</span>
                </div>

                <q-btn 
                  label="Actualizar Contraseña" 
                  color="primary" 
                  icon="save" 
                  @click="changePassword" 
                  unelevated
                  class="full-width"
                />

                <q-expansion-item
                  dense
                  label="Consejos para una contraseña segura"
                  icon="info"
                  class="password-tips-expansion"
                >
                  <q-card>
                    <q-card-section class="password-tips">
                      <ul>
                        <li>Usa al menos 8 caracteres</li>
                        <li>Combina mayúsculas y minúsculas</li>
                        <li>Incluye números y símbolos</li>
                        <li>Evita información personal</li>
                      </ul>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';
import { getData, postData } from '@/services/httpService';

export default {
  name: 'SecretariaProfile',
  setup() {
    const $q = useQuasar();
    const authStore = useAuthStore();

    const profile = ref({});
    const password = ref({ current: '', new: '', confirm: '' });
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
        await postData(`/api/users/${authStore.user.id}/photo`, { photo });
        $q.notify({ type: 'positive', message: 'Foto de perfil actualizada.' });
        await authStore.refreshUserData();
        if (authStore.user && authStore.user.profilePhoto) {
          profile.value.profilePhoto = authStore.user.profilePhoto;
        }
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
      password.value.current = '';
      password.value.new = '';
      password.value.confirm = '';
    };

    const changePassword = async () => {
      if (!password.value.current) {
        return $q.notify({ type: 'negative', message: 'Por favor, ingresa tu contraseña actual.' });
      }
      if (password.value.new !== password.value.confirm) {
        return $q.notify({ type: 'negative', message: 'Las contraseñas no coinciden.' });
      }
      if (password.value.new.length < 8) {
        return $q.notify({ type: 'negative', message: 'La contraseña debe tener al menos 8 caracteres.' });
      }
      try {
        const response = await postData(`/users/${authStore.user.id}/change-password`, {
          currentPassword: password.value.current,
          newPassword: password.value.new
        });
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
        const response = await getData(`/api/users/${authStore.user.id}`);
        profile.value = response;
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
      profile, password, loading, error,
      passwordStrengthClass, passwordStrengthText,
      changePhoto, changeSignature, changePassword,
    };
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 50px);
}

.loading-spinner,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 16px;
}

.profile-container {
  max-width: 1100px;
  margin: 0 auto;
}

.profile-header-card {
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  position: relative;
  background: #1E40AF;
  color: white;
  border-radius: 8px;
}

.profile-info {
  flex: 1;
  .profile-name {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
    color: white;
  }
  .profile-role, .profile-email {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 4px 0 0;
  }
}

.change-photo-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
  
  @media (min-width: 1101px) {
    gap: 24px;
  }
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

.section-header {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 6px;
  font-size: 0.9rem;
  
  strong {
    color: #555;
  }
}

.management-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  justify-content: flex-start;
}

.signature-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signature-preview {
  width: 100%;
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
    object-fit: contain;
  }
}

.signature-placeholder {
  text-align: center;
  color: #999;
  
  p {
    margin-top: 8px;
    font-size: 0.9rem;
  }
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.password-strength-indicator {
  width: 100%;
  
  .strength-bar-container {
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 6px;
  }
  
  .strength-bar {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 4px;
  }
  
  .strength-weak { 
    width: 33%; 
    background: linear-gradient(90deg, #e74c3c, #c0392b);
  }
  
  .strength-medium { 
    width: 66%; 
    background: linear-gradient(90deg, #f39c12, #e67e22);
  }
  
  .strength-strong { 
    width: 100%; 
    background: linear-gradient(90deg, #2ecc71, #27ae60);
  }
  
  .strength-text {
    font-size: 0.85rem;
    font-weight: 500;
    color: #666;
  }
}

.password-tips-expansion {
  margin-top: 8px;
  
  :deep(.q-item) {
    padding: 8px 0;
  }
}

.password-tips {
  background-color: #f0f7ff;
  padding: 12px;
  
  ul {
    margin: 0;
    padding-left: 20px;
    
    li {
      font-size: 0.85rem;
      color: #555;
      margin-bottom: 6px;
    }
  }
}

.full-width {
  width: 100%;
}
</style>