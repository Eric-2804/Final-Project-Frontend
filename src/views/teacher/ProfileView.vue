<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1 class="page-title">Mi Perfil</h1>

      <div class="row q-col-gutter-lg">
        <!-- Columna Izquierda: Foto y Datos Personales -->
        <div class="col-12 col-md-5">
          <!-- Card de Foto de Perfil -->
          <q-card flat bordered class="profile-card">
            <q-card-section class="text-center profile-header">
              <div class="avatar-wrapper">
                <q-avatar size="130px" class="profile-avatar">
                  <img :src="profile.photo || 'https://cdn.quasar.dev/img/boy-avatar.png'">
                </q-avatar>
                <q-btn 
                  round
                  dense
                  size="sm"
                  color="primary" 
                  icon="photo_camera"
                  class="avatar-edit-btn"
                  @click="changePhoto"
                >
                  <q-tooltip>Cambiar foto</q-tooltip>
                </q-btn>
              </div>
              <h2 class="profile-name q-mt-md">{{ profile.name }}</h2>
              <q-chip 
                color="primary" 
                text-color="white" 
                size="md"
                class="profile-role-chip"
              >
                {{ profile.role }}
              </q-chip>
            </q-card-section>
          </q-card>

          <!-- Card de Información Personal -->
          <q-card flat bordered class="info-card q-mt-lg">
            <q-card-section>
              <div class="section-header">
                <q-icon name="person" size="24px" color="primary" />
                <h3 class="section-title">Información Personal</h3>
              </div>
              <q-separator class="q-my-md" />
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="email" size="18px" color="grey-7" />
                    <span>Email</span>
                  </div>
                  <span class="info-value">{{ profile.email }}</span>
                </div>
                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="badge" size="18px" color="grey-7" />
                    <span>Documento</span>
                  </div>
                  <span class="info-value">{{ profile.document }}</span>
                </div>
                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="phone" size="18px" color="grey-7" />
                    <span>Teléfono</span>
                  </div>
                  <span class="info-value">{{ profile.phone }}</span>
                </div>
                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="location_on" size="18px" color="grey-7" />
                    <span>Dirección</span>
                  </div>
                  <span class="info-value">{{ profile.address }}</span>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Card de Carga Académica -->
          <q-card flat bordered class="info-card q-mt-lg">
            <q-card-section>
              <div class="section-header">
                <q-icon name="school" size="24px" color="primary" />
                <h3 class="section-title">Carga Académica</h3>
              </div>
              <q-separator class="q-my-md" />
              <div class="academic-list">
                <div v-for="item in academicLoad" :key="item.id" class="academic-item">
                  <div class="academic-info">
                    <q-icon name="class" size="20px" color="primary" class="q-mr-sm" />
                    <div>
                      <div class="academic-group">{{ item.group }}</div>
                      <div class="academic-subject">{{ item.subject }}</div>
                    </div>
                  </div>
                  <q-icon name="chevron_right" size="20px" color="grey-5" />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Card de Firma Digital -->
          <q-card flat bordered class="info-card q-mt-lg">
            <q-card-section>
              <div class="section-header">
                <q-icon name="draw" size="24px" color="primary" />
                <h3 class="section-title">Firma Digital</h3>
              </div>
              <q-separator class="q-my-md" />
              <div class="text-center">
                <div v-if="profile.signature" class="signature-preview">
                  <img :src="profile.signature" alt="Firma" />
                </div>
                <div v-else class="signature-placeholder">
                  <q-icon name="gesture" size="48px" color="grey-5" />
                  <p class="text-grey-6 q-mt-sm">No hay firma registrada</p>
                </div>
                <q-btn 
                  unelevated
                  color="primary" 
                  :label="profile.signature ? 'Cambiar Firma' : 'Subir Firma'" 
                  size="md"
                  class="q-mt-md"
                  icon="upload"
                  @click="changeSignature" 
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Columna Derecha: Cambiar Contraseña -->
        <div class="col-12 col-md-7">
          <q-card flat bordered class="password-card">
            <q-card-section>
              <div class="section-header">
                <q-icon name="lock" size="24px" color="primary" />
                <h3 class="section-title">Cambiar Contraseña</h3>
              </div>
              <p class="section-subtitle">Actualiza tu contraseña para mantener tu cuenta segura.</p>
              <q-separator class="q-my-md" />

              <q-form @submit.prevent="changePassword" class="password-form">
                <div class="form-group">
                  <label class="form-label">Contraseña Actual</label>
                  <q-input 
                    v-model="password.current"
                    type="password"
                    outlined
                    dense
                    placeholder="Ingresa tu contraseña actual"
                    :rules="[val => !!val || 'Campo requerido']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_open" />
                    </template>
                  </q-input>
                </div>

                <div class="form-group">
                  <label class="form-label">Nueva Contraseña</label>
                  <q-input 
                    v-model="password.new"
                    type="password"
                    outlined
                    dense
                    placeholder="Ingresa tu nueva contraseña"
                    :rules="[
                      val => !!val || 'Campo requerido',
                      val => val.length >= 6 || 'Mínimo 6 caracteres'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                  <div class="password-strength q-mt-sm">
                    <div class="strength-bar">
                      <div 
                        class="strength-fill" 
                        :class="passwordStrengthClass"
                        :style="{ width: passwordStrength + '%' }"
                      ></div>
                    </div>
                    <span class="strength-text" :class="passwordStrengthClass">
                      {{ passwordStrengthText }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Confirmar Nueva Contraseña</label>
                  <q-input 
                    v-model="password.confirm"
                    type="password"
                    outlined
                    dense
                    placeholder="Confirma tu nueva contraseña"
                    :rules="[
                      val => !!val || 'Campo requerido',
                      val => val === password.new || 'Las contraseñas no coinciden'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                </div>

                <q-banner v-if="showPasswordTips" dense rounded class="bg-blue-1 text-grey-8 q-mt-md">
                  <template v-slot:avatar>
                    <q-icon name="info" color="primary" />
                  </template>
                  <div class="text-caption">
                    <strong>Recomendaciones:</strong>
                    <ul class="q-pl-md q-mt-xs q-mb-none">
                      <li>Usa al menos 8 caracteres</li>
                      <li>Combina letras, números y símbolos</li>
                      <li>No uses información personal</li>
                    </ul>
                  </div>
                </q-banner>

                <div class="form-actions">
                  <q-btn 
                    flat
                    label="Cancelar" 
                    color="grey-7"
                    size="md"
                    @click="resetPasswordForm"
                  />
                  <q-btn 
                    type="submit"
                    unelevated
                    label="Guardar Cambios" 
                    color="primary"
                    size="md"
                    icon-right="check"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>

          <!-- Card de Seguridad Adicional -->
          <q-card flat bordered class="info-card q-mt-lg">
            <q-card-section>
              <div class="section-header">
                <q-icon name="security" size="24px" color="primary" />
                <h3 class="section-title">Seguridad de la Cuenta</h3>
              </div>
              <q-separator class="q-my-md" />
              <div class="security-options">
                <div class="security-item">
                  <div class="security-info">
                    <q-icon name="history" size="22px" color="grey-7" />
                    <div>
                      <div class="security-label">Última sesión</div>
                      <div class="security-value">Hace 2 horas</div>
                    </div>
                  </div>
                </div>
                <div class="security-item">
                  <div class="security-info">
                    <q-icon name="devices" size="22px" color="grey-7" />
                    <div>
                      <div class="security-label">Dispositivos activos</div>
                      <div class="security-value">2 dispositivos</div>
                    </div>
                  </div>
                  <q-btn flat dense color="primary" label="Ver" size="sm" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useNotify } from '../../composables/useNotify.js';

export default {
  name: 'TeacherProfile',
  setup() {
    const { showNotify, showErrorNotify } = useNotify();

    const profile = ref({
      name: 'Nombre del Docente',
      role: 'Docente',
      document: '12345678',
      email: 'docente@example.com',
      phone: '3001234567',
      address: 'Calle Principal #123',
      photo: null,
      signature: null,
    });

    const academicLoad = ref([
      { id: 1, group: 'Grupo A', subject: 'Matemáticas' },
      { id: 2, group: 'Grupo B', subject: 'Física' },
      { id: 3, group: 'Grupo C', subject: 'Química' },
    ]);

    const password = ref({
      current: '',
      new: '',
      confirm: '',
    });

    const showPasswordTips = ref(false);

    const passwordStrength = computed(() => {
      const pwd = password.value.new;
      if (!pwd) return 0;
      let strength = 0;
      if (pwd.length >= 6) strength += 25;
      if (pwd.length >= 8) strength += 25;
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
      if (/\d/.test(pwd)) strength += 15;
      if (/[^a-zA-Z\d]/.test(pwd)) strength += 10;
      return Math.min(strength, 100);
    });

    const passwordStrengthText = computed(() => {
      const strength = passwordStrength.value;
      if (strength === 0) return '';
      if (strength < 40) return 'Débil';
      if (strength < 70) return 'Media';
      return 'Fuerte';
    });

    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value;
      if (strength < 40) return 'strength-weak';
      if (strength < 70) return 'strength-medium';
      return 'strength-strong';
    });

    const changePhoto = () => {
      showNotify({ message: 'Función para cambiar foto' });
    };

    const changeSignature = () => {
      showNotify({ message: 'Función para cambiar firma' });
    };

    const changePassword = () => {
      if (password.value.new !== password.value.confirm) {
        showErrorNotify({ message: 'Las contraseñas no coinciden' });
        return;
      }
      
      if (password.value.new.length < 6) {
        showErrorNotify({ message: 'La contraseña debe tener al menos 6 caracteres' });
        return;
      }

      showNotify({
        message: 'Contraseña cambiada exitosamente',
        type: 'positive',
      });
      
      resetPasswordForm();
    };

    const resetPasswordForm = () => {
      password.value = {
        current: '',
        new: '',
        confirm: '',
      };
      showPasswordTips.value = false;
    };

    return {
      profile,
      academicLoad,
      password,
      showPasswordTips,
      passwordStrength,
      passwordStrengthText,
      passwordStrengthClass,
      changePhoto,
      changeSignature,
      changePassword,
      resetPasswordForm,
    };
  },
};
</script>

<style scoped>
.profile-page {
  background: #f8f9fa;
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 32px 0;
  letter-spacing: -0.5px;
}

/* Cards */
.profile-card,
.info-card,
.password-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.profile-card:hover,
.info-card:hover,
.password-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Profile Header */
.profile-header {
  padding: 32px 24px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  border: 4px solid #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.profile-name {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 16px 0 8px 0;
  letter-spacing: -0.3px;
}

.profile-role-chip {
  font-weight: 600;
  font-size: 14px;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.2px;
}

.section-subtitle {
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
  line-height: 1.5;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
  text-align: right;
}

/* Academic Load */
.academic-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.academic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.academic-item:hover {
  background: #e8f4f8;
  transform: translateX(4px);
}

.academic-info {
  display: flex;
  align-items: center;
}

.academic-group {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.academic-subject {
  font-size: 13px;
  color: #666;
}

/* Signature */
.signature-preview {
  background: #f8f9fa;
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  display: inline-block;
}

.signature-preview img {
  max-width: 250px;
  height: auto;
  display: block;
}

.signature-placeholder {
  background: #f8f9fa;
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  padding: 48px 24px;
  margin-bottom: 16px;
}

/* Password Form */
.password-form {
  max-width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-weak {
  background: #ef5350;
  color: #ef5350;
}

.strength-medium {
  background: #ffa726;
  color: #ffa726;
}

.strength-strong {
  background: #66bb6a;
  color: #66bb6a;
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
  min-width: 60px;
  text-align: right;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

/* Security Options */
.security-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.security-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
}

.security-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }

  .page-title {
    font-size: 26px;
    margin-bottom: 24px;
  }

  .profile-name {
    font-size: 22px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>