<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">Configuración del Sistema</div>

    <q-list bordered class="rounded-borders">
      <q-expansion-item
        expand-separator
        icon="settings"
        label="Configuración General"
        header-class="bg-blue-1 text-blue-10"
        default-opened
      >
        <q-card>
          <q-card-section>
            <q-form @submit.prevent="saveGeneralConfiguration" class="q-gutter-md">
              <div v-if="loading" class="text-center">
                <q-spinner-dots color="primary" size="40px" />
                <p>Cargando configuración...</p>
              </div>
              <div v-else-if="error" class="text-red">
                {{ error }}
              </div>
              <div v-else>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="generalConfig.rector"
                      :options="rectores"
                      label="Rector"
                      option-value="_id"
                      :option-label="opt => `${opt.nombre} ${opt.apellido}`"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="generalConfig.secretaria"
                      :options="secretarias"
                      label="Secretaria / Administrador"
                      option-value="_id"
                      :option-label="opt => `${opt.nombre} ${opt.apellido}`"
                      emit-value
                      map-options
                    />
                  </div>
                </div>

                <q-checkbox v-model="generalConfig.ligadoCalificacion" label="Ligado calificación" />
                <q-checkbox v-model="generalConfig.ligadoPeriodo" label="Ligado período" />

                <q-input
                  v-model="generalConfig.encabezadoCertificado"
                  label="Encabezado certificado"
                  type="textarea"
                  autogrow
                />

                <q-input
                  v-model="generalConfig.anoLectivo"
                  label="Año lectivo"
                  type="number"
                  style="max-width: 200px;"
                />

                <q-input
                  v-model="generalConfig.actaRecuperacion"
                  label="Acta de recuperación"
                />

                <q-input
                  v-model="generalConfig.dane"
                  label="Dane"
                />

                <q-checkbox v-model="generalConfig.permitirCambiarFoto" label="Permitir cambiar foto a estudiante" />
              </div>

              <div class="q-mt-lg">
                <q-btn label="Guardar" type="submit" color="primary" :loading="saving" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="school"
        label="Configuración de Notas"
        header-class="bg-blue-1 text-blue-10"
      >
        <q-card>
          <q-card-section>
            <p>Opciones de configuración de notas (próximamente).</p>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="event"
        label="Configuración Final"
        header-class="bg-blue-1 text-blue-10"
      >
        <q-card>
          <q-card-section>
            <p>Opciones de configuración final (próximamente).</p>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        expand-separator
        icon="image"
        label="Configuración de Imágenes"
        header-class="bg-blue-1 text-blue-10"
      >
        <q-card>
          <q-card-section>
            <p>Opciones de configuración de imágenes (próximamente).</p>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import parameterService from '../services/parameterService';
import schoolUserService from '../services/schoolUserService';
import { useAuthStore } from '../stores/auth';

const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(true);
const saving = ref(false);
const error = ref(null);

const generalConfig = ref({
  rector: null,
  secretaria: null,
  ligadoCalificacion: false,
  ligadoPeriodo: false,
  encabezadoCertificado: '',
  anoLectivo: new Date().getFullYear(),
  actaRecuperacion: '',
  dane: '',
  permitirCambiarFoto: false,
});

const rectores = ref([]);
const secretarias = ref([]);

async function loadConfiguration() {
  loading.value = true;
  error.value = null;
  try {
    const response = await parameterService.getAllParametros();
    if (response.data && response.data.length > 0) {
      const params = response.data.reduce((acc, param) => {
        acc[param.nombre] = param.valor;
        return acc;
      }, {});

      generalConfig.value = {
        rector: params.rector_id || null,
        secretaria: params.secretaria_id || null,
        ligadoCalificacion: params.ligado_calificacion === 'true',
        ligadoPeriodo: params.ligado_periodo === 'true',
        encabezadoCertificado: params.encabezado_certificado || '',
        anoLectivo: parseInt(params.ano_lectivo, 10) || new Date().getFullYear(),
        actaRecuperacion: params.acta_recuperacion || '',
        dane: params.dane || '',
        permitirCambiarFoto: params.permitir_cambiar_foto === 'true',
      };
    }
  } catch (err) {
    console.error('Error al cargar la configuración:', err);
    error.value = 'No se pudo cargar la configuración. Intente de nuevo más tarde.';
    $q.notify({
      color: 'negative',
      message: error.value,
      icon: 'report_problem',
    });
  } finally {
    loading.value = false;
  }
}

async function loadUsers() {
  try {
    const collegeId = authStore.user.colegio;
    if (!collegeId) {
      throw new Error('El usuario no está asociado a un colegio.');
    }
    const [rectoresRes, secretariasRes] = await Promise.all([
      schoolUserService.getUsersByRoleAndCollege('rector', collegeId),
      schoolUserService.getUsersByRoleAndCollege('secretaria', collegeId)
    ]);
    rectores.value = rectoresRes.data;
    secretarias.value = secretariasRes.data;
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    $q.notify({
      color: 'negative',
      message: 'Error al cargar la lista de rectores y secretarias.',
      icon: 'warning',
    });
  }
}

async function saveGeneralConfiguration() {
  saving.value = true;
  try {
    const paramsToSave = [
      { nombre: 'rector_id', valor: generalConfig.value.rector },
      { nombre: 'secretaria_id', valor: generalConfig.value.secretaria },
      { nombre: 'ligado_calificacion', valor: String(generalConfig.value.ligadoCalificacion) },
      { nombre: 'ligado_periodo', valor: String(generalConfig.value.ligadoPeriodo) },
      { nombre: 'encabezado_certificado', valor: generalConfig.value.encabezadoCertificado },
      { nombre: 'ano_lectivo', valor: String(generalConfig.value.anoLectivo) },
      { nombre: 'acta_recuperacion', valor: generalConfig.value.actaRecuperacion },
      { nombre: 'dane', valor: generalConfig.value.dane },
      { nombre: 'permitir_cambiar_foto', valor: String(generalConfig.value.permitirCambiarFoto) },
    ];

    await parameterService.createOrUpdateParametros(paramsToSave);

    $q.notify({
      color: 'positive',
      message: 'Configuración general guardada con éxito.',
      icon: 'check_circle',
    });
  } catch (err) {
    console.error('Error al guardar la configuración:', err);
    $q.notify({
      color: 'negative',
      message: 'Error al guardar la configuración. Verifique los datos e intente de nuevo.',
      icon: 'report_problem',
    });
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadConfiguration();
  loadUsers();
});
</script>

<style scoped>
.q-list .q-expansion-item .q-card {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>