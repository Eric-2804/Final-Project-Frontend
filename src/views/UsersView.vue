<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <section class="col-12">
        <q-card class="shadow1">
          <q-card-section>
            <div v-if="isLoading" class="text-center q-pa-xl">
              <q-spinner size="50px" color="primary" />
              <div class="loadingMessage">Cargando usuarios...</div>
            </div>

            <div class="row items-center q-mb-lg">
              <q-card-section class="pageHeaderInfo">
                <div class="pageTitle">
                  Gestión de Usuarios Administrativos
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  Administra los usuarios administrativos de la institución
                </div>
              </q-card-section>

              <q-space />
              <div class="actionButtonContainer">
                <q-btn 
                  v-if="canCreate" 
                  color="primary" 
                  icon="add" 
                  label="AGREGAR USUARIO" 
                  @click="openCreateDialog" 
                />
              </div>
            </div>

            <!-- Filtros -->
            <div class="row q-mb-md q-gutter-sm">
              <q-select
                v-model="filterRole"
                :options="roleOptions"
                label="Filtrar por rol"
                outlined
                dense
                clearable
                emit-value
                map-options
                style="min-width: 200px"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon 
                        :name="getRoleIcon(scope.opt.value)" 
                        :color="getRoleColor(scope.opt.value)"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <Table 
              v-if="!isLoading && usersList.length > 0" 
              :rows="filteredRows" 
              :columns="columns" 
              :actions="canEdit"
              row-key="_id"
            >

              <template v-slot:body-cell-fullName="props">
                <q-td :props="props">
                  <div class="text-weight-medium">{{ props.row.names }} {{ props.row.lastNames }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-document="props">
                <q-td :props="props">
                  <div>{{ props.row.typeDocument ? `${props.row.typeDocument}: ${props.row.numberDocument}` : props.row.numberDocument }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-rol="props">
                <q-td :props="props">
                  <q-chip 
                    :color="getRoleColor(props.value)" 
                    text-color="white" 
                    dense
                  >
                    {{ getRoleLabel(props.value) }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-assignment="props">
                <q-td :props="props">
                  <div v-if="props.value">
                    <q-icon name="location_on" size="xs" class="q-mr-xs" />
                    {{ props.value }}
                  </div>
                  <span v-else class="text-grey-6">—</span>
                </q-td>
              </template>

              <template v-slot:body-cell-active="props">
                <q-td :props="props">
                  <q-chip 
                    :color="props.value ? 'positive' : 'grey'" 
                    text-color="white" 
                    dense
                  >
                    {{ props.value ? 'Activo' : 'Inactivo' }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props" v-if="canEdit">
                <q-td :props="props">
                  <q-btn 
                    flat 
                    round 
                    dense 
                    icon="edit" 
                    color="primary" 
                    @click="handleEdit(props.row)"
                    title="Editar"
                    :disable="isSaving || isDeleting || isToggling"
                  />
                  <q-btn 
                    flat 
                    round 
                    dense 
                    :icon="props.row.active ? 'toggle_on' : 'toggle_off'"
                    :color="props.row.active ? 'positive' : 'grey'"
                    @click="toggleStatus(props.row)"
                    :title="props.row.active ? 'Desactivar' : 'Activar'"
                    :loading="isToggling && togglingItemId === props.row._id"
                    :disable="isSaving || isDeleting || (isToggling && togglingItemId !== props.row._id)"
                  />
                  <q-btn 
                    flat 
                    round 
                    dense 
                    icon="delete" 
                    color="negative"
                    @click="handleDelete(props.row)"
                    title="Eliminar"
                    :disable="isSaving || isDeleting || isToggling"
                  />
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="text-center q-pa-md">
                  No hay usuarios registrados
                </div>
              </template>
            </Table>
            
            <div v-if="!isLoading && usersList.length === 0" class="text-center q-pa-xl">
              <q-icon name="inbox" size="64px" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-6">No hay datos disponibles</div>
              <div class="text-caption text-grey-6 q-mt-sm">No se encontraron usuarios registrados</div>
            </div>

            <!-- Diálogo de confirmación de eliminación -->
            <q-dialog v-model="showDeleteDialog" persistent>
              <q-card style="min-width: 380px; max-width: 450px" class="delete-dialog-card">
                <q-card-section class="text-center q-pa-lg">
                  <q-icon name="delete_outline" size="64px" color="negative" class="q-mb-md" />
                  <div class="text-h6 q-mb-xs">¿Eliminar usuario?</div>
                  <div class="text-body2 text-grey-7 q-mb-md">
                    {{ itemToDelete?.names }} {{ itemToDelete?.lastNames }}
                  </div>
                  <div class="text-caption text-grey-6">
                    Esta acción no se puede deshacer
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-actions align="center" class="q-pa-md">
                  <q-btn 
                    flat 
                    label="Cancelar" 
                    color="grey-7" 
                    @click="showDeleteDialog = false"
                    :disable="isDeleting"
                    class="q-px-xl"
                  />
                  <q-btn 
                    unelevated
                    label="Eliminar" 
                    color="negative" 
                    @click="confirmDelete"
                    :loading="isDeleting"
                    class="q-px-xl"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- Diálogo de previsualización de foto -->
            <q-dialog v-model="previewPhoto">
              <q-card style="min-width: 300px">
                <q-card-section>
                  <div class="text-h6">Previsualización de Foto</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-img 
                    :src="formData.profilePhoto" 
                    style="max-width: 100%; max-height: 400px;"
                    placeholder-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23ddd' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E"
                  />
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cerrar" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- Diálogo de creación/edición -->
            <q-dialog v-model="showDialog" persistent>
              <q-card style="min-width: 600px; max-width: 90vw; max-height: 90vh" class="dialog-card">
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">
                    {{ isEditMode ? 'Editar' : 'Crear' }} {{ selectedRoleType ? selectedRoleType.label : getRoleLabel(formData.roles[0]) }}
                  </div>
                  <q-space />
                  <q-btn icon="close" flat round dense @click="closeDialog" />
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-md" style="max-height: calc(90vh - 100px); overflow-y: auto">
                  <q-form @submit.prevent="submitForm" ref="formRef">
                    <!-- Sección: Información Personal -->
                    <div class="q-mb-md">
                      <div class="text-subtitle2 text-primary q-mb-sm">
                        <q-icon name="person" class="q-mr-xs" />
                        Información Personal
                      </div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                          <q-input 
                            v-model="formData.names" 
                            label="Nombres *" 
                            outlined
                            dense
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-6">
                          <q-input 
                            v-model="formData.lastNames" 
                            label="Apellidos *" 
                            outlined
                            dense
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-6">
                          <q-select
                            v-model="formData.typeDocument"
                            :options="typeDocumentOptions"
                            label="Tipo de documento *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :disable="isEditMode"
                            :rules="[val => !!val || 'Campo requerido']"
                            hint="No se puede cambiar al editar"
                          />
                        </div>

                        <div class="col-12 col-md-6">
                          <q-input 
                            v-model="formData.numberDocument" 
                            label="Número de documento *" 
                            outlined
                            dense
                            :disable="isEditMode"
                            :rules="[
                              val => !!val || 'Campo requerido',
                              val => !val || /^\d+$/.test(val) || 'Solo números'
                            ]"
                            hint="No se puede cambiar al editar"
                          />
                        </div>

                        <div class="col-12 col-md-6">
                          <q-input 
                            v-model="formData.email" 
                            label="Email *" 
                            type="email"
                            outlined
                            dense
                            :rules="[val => !!val || 'Campo requerido', val => /.+@.+\..+/.test(val) || 'Email inválido']"
                          />
                        </div>

                        <div class="col-12 col-md-6">
                          <q-input 
                            v-model="formData.cellphone" 
                            label="Teléfono *" 
                            outlined
                            dense
                            mask="##########"
                            hint="10 dígitos"
                            :rules="[
                              val => !!val || 'Campo requerido',
                              val => /^\d{10}$/.test(val) || 'Debe tener exactamente 10 dígitos'
                            ]"
                          />
                        </div>

                        <div class="col-12">
                          <q-input 
                            v-model="formData.direction" 
                            label="Dirección *" 
                            outlined
                            dense
                            type="textarea"
                            rows="2"
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-6">
                          <q-input 
                            v-model="formData.dateBorn" 
                            label="Fecha de nacimiento *" 
                            outlined
                            dense
                            mask="##/##/####"
                            fill-mask="0"
                            hint="DD/MM/YYYY"
                            :rules="[
                              val => !!val || 'Campo requerido',
                              val => {
                                if (!val) return true;
                                const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                                if (!dateRegex.test(val)) return 'Formato inválido. Use DD/MM/YYYY';
                                const [, day, month, year] = val.match(dateRegex);
                                const d = new Date(year, month - 1, day);
                                if (d.getDate() != day || d.getMonth() != month - 1 || d.getFullYear() != year) {
                                  return 'Fecha inválida';
                                }
                                return true;
                              }
                            ]"
                          >
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="formData.dateBorn" mask="DD/MM/YYYY">
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                    </div>
                                  </q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </div>

                        <div class="col-12 col-md-6">
                          <q-select
                            v-model="formData.gender"
                            :options="genderOptions"
                            label="Género *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>
                      </div>
                    </div>

                    <q-separator class="q-my-md" />

                    <!-- Sección: Tipo de Usuario -->
                    <div class="q-mb-md">
                      <div class="text-subtitle2 text-primary q-mb-sm">
                        <q-icon name="badge" class="q-mr-xs" />
                        Tipo de Usuario
                      </div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <q-select
                            v-model="selectedRoleTypeValue"
                            :options="roleTypeOptions"
                            label="Tipo de Usuario *"
                            outlined
                            dense
                            emit-value
                            map-options
                            option-value="value"
                            option-label="label"
                            :rules="[val => !!val || 'Campo requerido']"
                            @update:model-value="onRoleTypeChange"
                            :disable="isEditMode"
                            hint="No se puede cambiar al editar"
                          >
                            <template v-slot:option="scope">
                              <q-item v-bind="scope.itemProps">
                                <q-item-section avatar>
                                  <q-icon 
                                    :name="getRoleIcon(scope.opt.roleValue)" 
                                    :color="getRoleColor(scope.opt.roleValue)"
                                  />
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                                  <q-item-label caption>
                                    {{ scope.opt.needsHeadquarters ? 'Nivel Sede' : 'Nivel Colegio' }}
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                          <div class="text-caption text-grey-7 q-mt-xs q-ml-sm">
                            <q-icon name="info" size="xs" class="q-mr-xs" />
                            Selecciona el tipo de usuario administrativo que deseas crear
                          </div>
                        </div>
                      </div>
                    </div>

                    <q-separator class="q-my-md" />

                    <!-- Sección: Información Administrativa -->
                    <div class="q-mb-md">
                      <div class="text-subtitle2 text-primary q-mb-sm">
                        <q-icon name="business" class="q-mr-xs" />
                        Información Administrativa
                      </div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <q-select
                            v-model="formData.college"
                            :options="collegeOptions"
                            label="Colegio *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="[val => !!val || 'Campo requerido']"
                            @update:model-value="onCollegeChange"
                            :loading="loadingColleges"
                            :disable="isEditMode"
                            hint="No se puede cambiar al editar"
                            clearable
                          >
                            <template v-slot:no-option>
                              <q-item>
                                <q-item-section class="text-grey">
                                  {{ loadingColleges ? 'Cargando colegios...' : 'No hay colegios disponibles' }}
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>

                        <!-- Selector de Sede - Solo para coordinador y secretaria -->
                        <div class="col-12" v-if="needsHeadquarters">
                          <q-select
                            v-model="formData.headquarters"
                            :options="headquartersOptions"
                            label="Sede *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="[val => !!val || 'Campo requerido']"
                            :disable="!formData.college || isEditMode"
                            :loading="loadingHeadquarters"
                            :hint="!formData.college ? 'Seleccione primero un colegio' : (isEditMode ? 'No se puede cambiar la sede al editar' : '')"
                            clearable
                          >
                            <template v-slot:no-option>
                              <q-item>
                                <q-item-section class="text-grey">
                                  {{ loadingHeadquarters ? 'Cargando sedes...' : (!formData.college ? 'Seleccione un colegio primero' : 'No hay sedes disponibles para este colegio') }}
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>
                      </div>
                    </div>

                    <!-- Sección: Foto de Perfil -->
                    <q-separator class="q-my-md" />
                    <div class="q-mb-md">
                      <div class="text-subtitle2 text-primary q-mb-sm">
                        <q-icon name="photo_camera" class="q-mr-xs" />
                        Foto de Perfil
                      </div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <q-input 
                            v-model="formData.profilePhoto" 
                            label="URL de Foto de Perfil" 
                            outlined
                            dense
                            hint="Ingrese la URL de la foto de perfil (opcional)"
                            placeholder="https://ejemplo.com/foto.jpg"
                          >
                            <template v-slot:prepend>
                              <q-icon name="link" />
                            </template>
                            <template v-slot:append v-if="formData.profilePhoto">
                              <q-btn 
                                flat 
                                dense 
                                round 
                                icon="preview" 
                                @click="previewPhoto = true"
                                size="sm"
                              >
                                <q-tooltip>Ver previsualización</q-tooltip>
                              </q-btn>
                            </template>
                          </q-input>
                          <div v-if="formData.profilePhoto" class="q-mt-sm">
                            <q-img 
                              :src="formData.profilePhoto" 
                              style="max-width: 200px; max-height: 200px; border-radius: 8px;"
                              placeholder-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ECargando...%3C/text%3E%3C/svg%3E"
                              @error="handleImageError"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Sección: Información Adicional -->
                    <q-separator class="q-my-md" />
                    <div class="q-mb-md">
                      <div class="text-subtitle2 text-primary q-mb-sm">
                        <q-icon name="info" class="q-mr-xs" />
                        Información Adicional
                      </div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.stratum"
                            :options="stratumOptions"
                            label="Estratum *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-input 
                            v-model="formData.sisben" 
                            label="SISBEN *" 
                            outlined
                            dense
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-input 
                            v-model="formData.eps" 
                            label="EPS *" 
                            outlined
                            dense
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.typeBlood"
                            :options="typeBloodOptions"
                            label="Tipo de Sangre *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-toggle
                            v-model="formData.victimPopulation"
                            label="Población Víctima *"
                            color="primary"
                            left-label
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.disability"
                            :options="disabilityOptions"
                            label="Discapacidad *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.ethnic"
                            :options="ethnicOptions"
                            label="Etnia *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="[val => !!val || 'Campo requerido']"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Sección: Seguridad - Solo al crear -->
                    <template v-if="!isEditMode">
                      <q-separator class="q-my-md" />
                      <div class="q-mb-md">
                        <div class="text-subtitle2 text-primary q-mb-sm">
                          <q-icon name="lock" class="q-mr-xs" />
                          Seguridad
                        </div>
                        <div class="row q-col-gutter-md">
                          <div class="col-12 col-md-6">
                            <q-input 
                              v-model="formData.password" 
                              label="Contraseña *" 
                              type="password"
                              outlined
                              dense
                              :rules="[val => !!val || 'Campo requerido', val => val.length >= 6 || 'Mínimo 6 caracteres']"
                            />
                          </div>
                          <div class="col-12 col-md-6">
                            <q-input 
                              v-model="formData.confirmPassword" 
                              label="Confirmar contraseña *" 
                              type="password"
                              outlined
                              dense
                              :rules="[val => !!val || 'Campo requerido', val => val === formData.password || 'Las contraseñas no coinciden']"
                            />
                          </div>
                        </div>
                      </div>
                    </template>

                    <div class="row q-mt-md justify-end">
                      <q-btn 
                        flat 
                        label="Cancelar" 
                        color="grey-7" 
                        class="q-mr-sm" 
                        @click="closeDialog"
                        :disable="isSaving"
                      />
                      <q-btn 
                        type="submit" 
                        color="primary" 
                        :label="isEditMode ? 'Guardar cambios' : 'Crear usuario'"
                        :loading="isSaving"
                      />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-card-section>
        </q-card>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useAuthStore } from '../stores/auth.js';
import Table from "../components/tables.vue"
import { useNotify } from "../composables/useNotify.js"
import {
  getUsersByRole,
  getUserById,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser,
  createUser
} from '../services/schoolUserService.js';
import { getSedesByColegio, getAllSedes } from '../services/headquarterService.js';
import { getAllColegios } from '../services/colegiosService.js';
import { getData } from '../services/httpService.js';
import { API_ENDPOINTS } from '../services/apiEndpoints.js';

const { showNotify: info, showErrorNotify: error } = useNotify()

const isLoading = ref(false)
const usersList = ref([])
const authStore = useAuthStore();
const filterRole = ref(null)
const isSaving = ref(false)
const isDeleting = ref(false)
const isToggling = ref(false)
const togglingItemId = ref(null)
const showDeleteDialog = ref(false)
const itemToDelete = ref(null)
const showDialog = ref(false)
const isEditMode = ref(false)
const editingItem = ref(null)
const formRef = ref(null)

// Opciones del formulario
const typeDocumentOptions = [
  { label: 'CC - Cédula de Ciudadanía', value: 'CC' },
  { label: 'TI - Tarjeta de Identidad', value: 'TI' },
  { label: 'CE - Cédula de Extranjería', value: 'CE' },
  { label: 'Pasaporte', value: 'Pasaporte' },
];

const genderOptions = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
  { label: 'Otro', value: 'Otro' },
];

const stratumOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
];

const typeBloodOptions = [
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
];

const disabilityOptions = [
  { label: 'Ninguna', value: 'NINGUNA' },
  { label: 'Física', value: 'FISICA' },
  { label: 'Auditiva', value: 'AUDITIVA' },
  { label: 'Visual', value: 'VISUAL' },
  { label: 'Cognitiva', value: 'COGNITIVA' },
  { label: 'Otra', value: 'OTRA' },
];

const ethnicOptions = [
  { label: 'Ninguna', value: 'NINGUNA' },
  { label: 'Indígena', value: 'INDIGENA' },
  { label: 'Afrocolombiano', value: 'AFRO' },
  { label: 'Raizal', value: 'RAIZAL' },
  { label: 'Otra', value: 'OTRA' },
];

const roleTypeOptions = [
  { label: 'Rector', value: 'rector', roleValue: 'rector', needsHeadquarters: false, description: 'Asignado a nivel de Colegio' },
  { label: 'Secretaria', value: 'secretaria', roleValue: 'secretaria', needsHeadquarters: true, description: 'Asignada a nivel de Sede' },
  { label: 'Coordinador', value: 'coordinador', roleValue: 'coordinador', needsHeadquarters: true, description: 'Asignado a nivel de Sede' },
];

// Variable para mantener el objeto completo del tipo seleccionado
const selectedRoleTypeValue = ref(null);

// Roles permitidos
const allowedRoles = ['secretaria', 'coordinador', 'rector'];

// Opciones de roles para el filtro
const roleOptions = [
  { label: 'Secretaria', value: 'secretaria' },
  { label: 'Coordinador', value: 'coordinador' },
  { label: 'Rector', value: 'rector' },
];

// Datos del formulario
const formData = ref({
  names: '',
  lastNames: '',
  typeDocument: 'CC',
  numberDocument: '',
  email: '',
  cellphone: '',
  direction: '',
  dateBorn: '',
  gender: 'M',
  college: '',
  headquarters: '',
  roles: ['rector'],
  password: '',
  confirmPassword: '',
  // Campos adicionales requeridos por el backend
  stratum: '',
  sisben: '',
  eps: '',
  typeBlood: 'O+',
  victimPopulation: false,
  disability: 'NINGUNA',
  ethnic: 'NINGUNA',
  profilePhoto: '',
  _id: null,
});

const collegeOptions = ref([])
const headquartersOptions = ref([])
const loadingColleges = ref(false)
const loadingHeadquarters = ref(false)
const selectedRoleType = ref(null)
const previewPhoto = ref(false)

// Verificar permisos según rol
const userRole = computed(() => authStore.user?.rol)
const canCreate = computed(() => userRole.value === 'secretaria')
const canEdit = computed(() => userRole.value === 'secretaria')

// Determinar si necesita selector de sede
const needsHeadquarters = computed(() => {
  return selectedRoleType.value?.needsHeadquarters || false;
});

// Funciones helper para roles
const getRoleLabel = (rol) => {
  const roleMap = {
    secretaria: 'Secretaria',
    coordinador: 'Coordinador',
    rector: 'Rector',
  };
  return roleMap[rol] || rol;
};

const getRoleIcon = (rol) => {
  const iconMap = {
    secretaria: 'admin_panel_settings',
    coordinador: 'supervisor_account',
    rector: 'school',
  };
  return iconMap[rol] || 'person';
};

const getRoleColor = (rol) => {
  const colorMap = {
    secretaria: 'purple',
    coordinador: 'blue',
    rector: 'indigo',
  };
  return colorMap[rol] || 'grey';
};

// Obtener texto de asignación para la tabla
const getAssignmentText = (user) => {
  const role = user.rol || user.roles?.[0];
  
  if (role === 'rector') {
    const collegeName = user.collegeInfo?.name || user.college?.nameSchool || user.college?.name || user.college?.nombre;
    return collegeName ? `Colegio: ${collegeName}` : 'N/A';
  }
  
  if (role === 'coordinador' || role === 'secretaria') {
    if (user.headquarters) {
      const hqName = typeof user.headquarters === 'object' 
        ? (user.headquarters.name || user.headquarters.nameSchool || user.headquarters.nombre)
        : null;
      if (hqName) {
        return `Sede: ${hqName}`;
      }
    }
    if (role === 'secretaria' && user.collegeInfo) {
      return `Colegio: ${user.collegeInfo.name}`;
    }
    return 'N/A';
  }
  
  return 'N/A';
};

// Cargar colegios directamente desde la API
const fetchColleges = async () => {
  try {
    loadingColleges.value = true;
    const response = await getAllColegios();
    
    let schools = [];
    if (Array.isArray(response)) {
      schools = response;
    } else if (response?.data) {
      schools = Array.isArray(response.data) ? response.data : [response.data];
    } else if (response?.schools) {
      schools = Array.isArray(response.schools) ? response.schools : [response.schools];
    } else if (response && typeof response === 'object') {
      schools = [response];
    }
    
    collegeOptions.value = schools
      .filter(school => {
        const hasId = school._id || school.id;
        const hasName = school.name || school.nameSchool || school.nombre;
        return hasId && hasName;
      })
      .map(school => ({
        label: school.name || school.nameSchool || school.nombre,
        value: school._id || school.id
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

  } catch (err) {
    console.error('Error cargando colegios:', err);
    const errorMsg = err.response?.data?.message || 
                     err.response?.data?.msg || 
                     err.message || 
                     'No se pudieron cargar los colegios';
    error({
      message: errorMsg,
      position: 'top'
    });
  } finally {
    loadingColleges.value = false;
  }
};

// Cargar sedes por colegio
const fetchHeadquarters = async (collegeId) => {
  if (!collegeId) {
    headquartersOptions.value = [];
    return;
  }
  
  try {
    loadingHeadquarters.value = true;
    const { HEADQUARTERS } = API_ENDPOINTS;
    const url = `${HEADQUARTERS.BASE}${HEADQUARTERS.BY_COLEGIO(collegeId)}`;
    const response = await getData(url);
    
    let data = [];
    if (Array.isArray(response)) {
      data = response;
    } else if (response?.data) {
      data = Array.isArray(response.data) ? response.data : [response.data];
    } else if (response?.sedes || response?.headquarters) {
      const sedesData = response.sedes || response.headquarters;
      data = Array.isArray(sedesData) ? sedesData : [sedesData];
    } else if (response && typeof response === 'object') {
      data = [response];
    }

    const mappedHeadquarters = data
      .filter(headquarters => {
        const hasName = headquarters?.name || headquarters?.nameSchool || headquarters?.nombre;
        const hasId = headquarters?._id || headquarters?.id;
        return hasName && hasId;
      })
      .map(headquarters => ({
        label: headquarters.name || headquarters.nameSchool || headquarters.nombre || 'Sin nombre',
        value: headquarters._id || headquarters.id
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    headquartersOptions.value = mappedHeadquarters;
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al cargar las sedes';
    error({
      message: errorMsg,
      position: 'top'
    });
  } finally {
    loadingHeadquarters.value = false;
  }
};

// Manejar cambio de tipo de rol
const onRoleTypeChange = (roleTypeValue) => {
  const roleType = roleTypeOptions.find(r => r.value === roleTypeValue);
  if (roleType) {
    selectedRoleType.value = roleType;
    formData.value.roles = [roleType.roleValue];
    
    if (!roleType.needsHeadquarters) {
      formData.value.headquarters = '';
      headquartersOptions.value = [];
    } else {
      if (formData.value.college) {
        fetchHeadquarters(formData.value.college);
      }
    }
  } else {
    selectedRoleType.value = null;
  }
};

// Manejar cambio de colegio
const onCollegeChange = async (collegeId) => {
  formData.value.headquarters = '';
  headquartersOptions.value = [];
  
  if (needsHeadquarters.value && collegeId) {
    await fetchHeadquarters(collegeId);
  }
};

// Manejar error de imagen
const handleImageError = () => {

};

// Cerrar diálogo
const closeDialog = () => {
  showDialog.value = false;
  isEditMode.value = false;
  editingItem.value = null;
  selectedRoleType.value = null;
  selectedRoleTypeValue.value = null;
  previewPhoto.value = false;
  formRef.value?.resetValidation();
}

// Enriquecer usuarios con información de colegio y sede
const enrichUsers = async (users) => {
  try {
    const response = await getAllColegios();
    
    let schools = [];
    if (Array.isArray(response)) {
      schools = response;
    } else if (response?.data) {
      schools = Array.isArray(response.data) ? response.data : [response.data];
    } else if (response?.schools) {
      schools = Array.isArray(response.schools) ? response.schools : [response.schools];
    } else if (response && typeof response === 'object') {
      schools = [response];
    }
    
    const normalizedSchools = schools
      .filter(school => {
        const hasId = school._id || school.id;
        const hasName = school.name || school.nameSchool || school.nombre;
        return hasId && hasName;
      })
      .map(school => ({
        _id: school._id || school.id,
        name: school.name || school.nameSchool || school.nombre || 'Sin nombre'
      }));
    
    let enrichedUsers = users.map(user => {
      const collegeId = typeof user.college === 'string' ? user.college : (user.college?._id || user.college?.id || null);
      const school = normalizedSchools.find(s => s._id === collegeId);
      
      return {
        ...user,
        collegeInfo: school || null
      };
    });
    
    // Para coordinador y secretaria, obtener información de sede desde Validity
    const coordSecretariaUsers = enrichedUsers.filter(u => {
      const role = u.rol || u.roles?.[0];
      return role === 'coordinador' || role === 'secretaria';
    });
    
    if (coordSecretariaUsers.length > 0) {
      try {
        const validityUrl = '/api/validity/activa';
        const validityResponse = await getData(validityUrl);
        const validity = validityResponse?.data || validityResponse;
        
        if (validity?.headquarterInfo && Array.isArray(validity.headquarterInfo)) {
          enrichedUsers = enrichedUsers.map(user => {
            const userId = user._id || user.id;
            
            for (const hqInfo of validity.headquarterInfo) {
              const coordinatorId = hqInfo.coordinator?._id || hqInfo.coordinator?.toString();
              const secretaryId = hqInfo.secretary?._id || hqInfo.secretary?.toString();
              
              if ((coordinatorId && coordinatorId === userId) || (secretaryId && secretaryId === userId)) {
                return {
                  ...user,
                  headquarters: hqInfo.headquarter || hqInfo.headquarters,
                  assignmentType: coordinatorId === userId ? 'coordinador' : 'secretaria'
                };
              }
            }
            return user;
          });
        }
      } catch (error) {
        console.error('Error obteniendo información de sede desde Validity:', error);
      }
    }
    
    return enrichedUsers.map(user => {
      const role = user.rol || user.roles?.[0];
      const names = user.names || user.nombres || user.firstName || '';
      const lastNames = user.lastNames || user.apellidos || user.lastName || '';
      const email = user.email || '';
      const numberDocument = user.numberDocument || user.numeroDocumento || '';
      const typeDocument = user.typeDocument || user.tipoDocumento || '';
      const cellphone = user.cellphone || user.cellPhone || user.celular || '';
      
      return {
        ...user,
        _id: user._id || user.id,
        names,
        lastNames,
        email,
        numberDocument,
        typeDocument,
        cellphone,
        rol: role,
        active: user.isActive !== undefined ? user.isActive : (user.active !== undefined ? user.active : true),
        fullName: `${names} ${lastNames}`.trim() || 'Sin nombre',
        document: typeDocument && numberDocument ? `${typeDocument}: ${numberDocument}` : (numberDocument || 'Sin documento'),
        assignment: getAssignmentText({
          ...user,
          rol: role,
          collegeInfo: user.collegeInfo,
          headquarters: user.headquarters
        })
      };
    });
  } catch (error) {
    console.error('Error enriqueciendo usuarios:', error);
    return users.map(user => {
      const role = user.rol || user.roles?.[0];
      return {
        ...user,
        fullName: `${user.names || ''} ${user.lastNames || ''}`.trim(),
        document: user.typeDocument ? `${user.typeDocument}: ${user.numberDocument || ''}` : (user.numberDocument || ''),
        assignment: 'N/A'
      };
    });
  }
};

// Cargar usuarios de todos los roles permitidos
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const promises = allowedRoles.map(rol => getUsersByRole(rol));
    const responses = await Promise.all(promises);
    
    let allUsers = [];
    
    responses.forEach((response, index) => {
      let users = [];
      const data = response?.data || response;
      
      if (Array.isArray(data)) {
        users = data;
      } else if (data?.users && Array.isArray(data.users)) {
        users = data.users;
      } else if (data && typeof data === 'object') {
        users = [data];
      }
      
      const filteredUsers = users
        .filter(user => {
          const userRole = user.rol || user.roles?.[0];
          return allowedRoles.includes(userRole);
        })
        .map(user => {
          const role = user.rol || user.roles?.[0];
          const collegeId = typeof user.college === 'string' ? user.college : (user.college?._id || user.college?.id || null);
          
          return {
            ...user,
            _id: user._id || user.id,
            rol: role,
            college: collegeId,
            active: user.isActive !== undefined ? user.isActive : (user.active !== undefined ? user.active : true),
          };
        });
      
      allUsers = [...allUsers, ...filteredUsers];
    });

    usersList.value = await enrichUsers(allUsers);
    
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al cargar los usuarios';
    error({
      message: errorMsg,
      position: 'top'
    });
    usersList.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Filtrar por rol
const filteredRows = computed(() => {
  if (!filterRole.value) return usersList.value;
  
  return usersList.value.filter(user => {
    const userRoleValue = user.rol?.toLowerCase() || '';
    const filterValue = filterRole.value?.toLowerCase() || '';
    return userRoleValue === filterValue;
  });
})

// Columnas de la tabla
const baseColumns = [
  { name: "fullName", label: "Nombre Completo", field: "fullName", align: "left", sortable: true },
  { name: "document", label: "Documento", field: "document", align: "center", sortable: true },
  { name: "email", label: "Email", field: "email", align: "left", sortable: true },
  { name: "cellphone", label: "Teléfono", field: "cellphone", align: "center", sortable: true },
  { name: "rol", label: "Rol", field: "rol", align: "center", sortable: true },
  { name: "assignment", label: "Asignación", field: "assignment", align: "left", sortable: true },
  { name: "active", label: "Estado", field: "active", align: "center", sortable: true },
];

const columns = computed(() => {
  const cols = [...baseColumns];
  if (canEdit.value) {
    cols.push({ name: "actions", label: "Acciones", field: "actions", align: "center" });
  }
  return cols;
});

// Cambiar estado activo/inactivo
// Según la documentación: POST /api/users/:id/activate y POST /api/users/:id/deactivate
const toggleStatus = async (user) => {
  try {
    isToggling.value = true;
    togglingItemId.value = user._id;
    
    // El backend usa 'isActive', pero en el frontend normalizamos a 'active' para visualización
    // Verificar ambos campos para compatibilidad
    const currentStatus = user.active !== undefined 
      ? Boolean(user.active) 
      : (user.isActive !== undefined ? Boolean(user.isActive) : true);
    
    if (currentStatus) {
      // Usuario está activo, desactivarlo usando POST /api/users/:id/deactivate
      await deactivateUser(user._id);
      info({
        message: 'Usuario desactivado correctamente',
        position: 'top'
      });
    } else {
      // Usuario está inactivo, activarlo usando POST /api/users/:id/activate
      await activateUser(user._id);
      info({
        message: 'Usuario activado correctamente',
        position: 'top'
      });
    }
    
    // Recargar la lista de usuarios para reflejar el cambio
    await fetchUsers();
  } catch (err) {
    console.error('Error al cambiar estado del usuario:', err);
    const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al cambiar el estado del usuario';
    error({
      message: errorMsg,
      position: 'top'
    });
  } finally {
    isToggling.value = false;
    togglingItemId.value = null;
  }
}

// Abrir diálogo de confirmación de eliminación
const handleDelete = (user) => {
  itemToDelete.value = user
  showDeleteDialog.value = true
}

// Confirmar eliminación
const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  try {
    isDeleting.value = true;
    await deleteUser(itemToDelete.value._id);
    
    await fetchUsers();
    
    info({
      message: 'Usuario eliminado correctamente',
      position: 'top'
    });
    showDeleteDialog.value = false;
    itemToDelete.value = null;
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al eliminar el usuario';
    error({
      message: errorMsg,
      position: 'top'
    });
  } finally {
    isDeleting.value = false;
  }
}

// Abre el diálogo para editar
const handleEdit = async (user) => {
  try {
    isEditMode.value = true;
    editingItem.value = user;
    
    selectedRoleType.value = null;
    selectedRoleTypeValue.value = null;
    headquartersOptions.value = [];
    
    const userData = await getUserById(user._id);
    const fullUser = userData?.data || userData || user;
    
    const userRole = Array.isArray(fullUser.roles) ? fullUser.roles[0] : (fullUser.rol || fullUser.roles || 'rector');
    
    const collegeId = typeof fullUser.college === 'string' 
      ? fullUser.college 
      : (fullUser.college?._id || fullUser.college?.id || '');
    
    let headquartersId = '';
    if ((userRole === 'coordinador' || userRole === 'secretaria') && user.headquarters) {
      if (typeof user.headquarters === 'string') {
        headquartersId = user.headquarters;
      } else if (user.headquarters?._id) {
        headquartersId = user.headquarters._id;
      }
    }
    
    await fetchColleges();
    
    formData.value = {
      _id: fullUser._id || fullUser.id || user._id,
      names: fullUser.names || user.names || '',
      lastNames: fullUser.lastNames || user.lastNames || '',
      typeDocument: fullUser.typeDocument || user.typeDocument || 'CC',
      numberDocument: fullUser.numberDocument || user.numberDocument || '',
      email: fullUser.email || user.email || '',
      cellphone: fullUser.cellphone || user.cellphone || '',
      direction: fullUser.direction || user.direction || '',
      dateBorn: fullUser.dateBorn || user.dateBorn || '',
      gender: fullUser.gender || user.gender || 'M',
      college: collegeId,
      headquarters: headquartersId,
      roles: Array.isArray(fullUser.roles) ? fullUser.roles : [userRole],
      password: '',
      confirmPassword: '',
      stratum: fullUser.stratum !== undefined ? fullUser.stratum : '',
      sisben: fullUser.sisben || '',
      eps: fullUser.eps || '',
      typeBlood: fullUser.typeBlood || 'O+',
      victimPopulation: fullUser.victimPopulation !== undefined ? fullUser.victimPopulation : false,
      disability: fullUser.disability || 'NINGUNA',
      ethnic: fullUser.ethnic || 'NINGUNA',
      profilePhoto: fullUser.profilePhoto || user.profilePhoto || '',
    };
    
    let roleType = null;
    if (userRole === 'rector') {
      roleType = roleTypeOptions.find(r => r.value === 'rector');
    } else if (userRole === 'coordinador') {
      roleType = roleTypeOptions.find(r => r.value === 'coordinador');
    } else if (userRole === 'secretaria') {
      roleType = roleTypeOptions.find(r => r.value === 'secretaria');
    }
    
    if (roleType) {
      selectedRoleType.value = roleType;
      selectedRoleTypeValue.value = roleType.value;
      
      if (collegeId && roleType.needsHeadquarters) {
        await fetchHeadquarters(collegeId);
        
        if (headquartersId && headquartersOptions.value.length > 0) {
          const exists = headquartersOptions.value.some(hq => hq.value === headquartersId);
          if (!exists) {
            const hqName = user.headquarters?.name || user.headquarters?.nameSchool || user.headquarters?.nombre || 'Sede asignada';
            headquartersOptions.value.push({
              label: hqName,
              value: headquartersId
            });
          }
        }
      }
    }
    
    showDialog.value = true;
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al cargar los datos del usuario';
    error({
      message: errorMsg,
      position: 'top'
    });
    isEditMode.value = false;
    editingItem.value = null;
  }
}

// Abre el diálogo para crear
const openCreateDialog = async () => {
  isEditMode.value = false;
  editingItem.value = null;
  const defaultRoleType = roleTypeOptions[0];
  selectedRoleType.value = defaultRoleType;
  selectedRoleTypeValue.value = defaultRoleType.value;
  
  formData.value = {
    names: '',
    lastNames: '',
    typeDocument: 'CC',
    numberDocument: '',
    email: '',
    cellphone: '',
    direction: '',
    dateBorn: '',
    gender: 'M',
    college: '',
    headquarters: '',
    roles: [defaultRoleType.roleValue],
    password: '',
    confirmPassword: '',
    stratum: '',
    sisben: '',
    eps: '',
    typeBlood: 'O+',
    victimPopulation: false,
    disability: 'NINGUNA',
    ethnic: 'NINGUNA',
    profilePhoto: '',
    _id: null,
  };
  
  await fetchColleges();
  showDialog.value = true;
}

// Validar formulario
const validateForm = () => {
  if (!formData.value.names?.trim()) {
    error({ message: 'El nombre es requerido', position: 'top' });
    return false;
  }
  if (!formData.value.lastNames?.trim()) {
    error({ message: 'Los apellidos son requeridos', position: 'top' });
    return false;
  }
  if (!formData.value.typeDocument) {
    error({ message: 'El tipo de documento es requerido', position: 'top' });
    return false;
  }
  if (!formData.value.numberDocument?.trim()) {
    error({ message: 'El número de documento es requerido', position: 'top' });
    return false;
  }
  const docNumber = formData.value.numberDocument.trim();
  if (!/^\d+$/.test(docNumber)) {
    error({ message: 'El número de documento solo puede contener números', position: 'top' });
    return false;
  }
  if (!formData.value.email?.trim()) {
    error({ message: 'El email es requerido', position: 'top' });
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email.trim())) {
    error({ message: 'El email no es válido', position: 'top' });
    return false;
  }
  if (!formData.value.cellphone?.trim()) {
    error({ message: 'El teléfono es requerido', position: 'top' });
    return false;
  }
  const phoneNumber = formData.value.cellphone.trim();
  if (!/^\d{10}$/.test(phoneNumber)) {
    error({ message: 'El teléfono debe tener exactamente 10 dígitos numéricos', position: 'top' });
    return false;
  }
  if (!formData.value.direction?.trim()) {
    error({ message: 'La dirección es requerida', position: 'top' });
    return false;
  }
  if (!formData.value.dateBorn?.trim()) {
    error({ message: 'La fecha de nacimiento es requerida', position: 'top' });
    return false;
  }
  const dateValue = formData.value.dateBorn.trim();
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!dateRegex.test(dateValue)) {
    error({ message: 'Formato de fecha inválido. Use DD/MM/YYYY', position: 'top' });
    return false;
  }
  const [, day, month, year] = dateValue.match(dateRegex);
  const d = new Date(year, month - 1, day);
  if (d.getDate() != day || d.getMonth() != month - 1 || d.getFullYear() != year) {
    error({ message: 'La fecha ingresada no es válida', position: 'top' });
    return false;
  }
  if (!formData.value.gender) {
    error({ message: 'El género es requerido', position: 'top' });
    return false;
  }
  if (!formData.value.college) {
    error({ message: 'Debe seleccionar un colegio', position: 'top' });
    return false;
  }
  if (needsHeadquarters.value && !formData.value.headquarters) {
    error({ message: 'Debe seleccionar una sede', position: 'top' });
    return false;
  }
  
  if (!formData.value.stratum) {
    error({ message: 'El estrato es requerido', position: 'top' });
    return false;
  }
  if (!formData.value.sisben?.trim()) {
    error({ message: 'El SISBEN es requerido', position: 'top' });
    return false;
  }
  if (!formData.value.eps?.trim()) {
    error({ message: 'La EPS es requerida', position: 'top' });
    return false;
  }
  if (!formData.value.typeBlood) {
    error({ message: 'El tipo de sangre es requerido', position: 'top' });
    return false;
  }
  if (formData.value.victimPopulation === undefined || formData.value.victimPopulation === null) {
    error({ message: 'Debe indicar si es población víctima', position: 'top' });
    return false;
  }
  if (!formData.value.disability?.trim()) {
    error({ message: 'La discapacidad es requerida', position: 'top' });
    return false;
  }
  if (!formData.value.ethnic?.trim()) {
    error({ message: 'La etnia es requerida', position: 'top' });
    return false;
  }
  
  if (!isEditMode.value) {
    if (!formData.value.password?.trim() || formData.value.password.length < 6) {
      error({ message: 'La contraseña debe tener al menos 6 caracteres', position: 'top' });
      return false;
    }
    if (formData.value.password !== formData.value.confirmPassword) {
      error({ message: 'Las contraseñas no coinciden', position: 'top' });
      return false;
    }
  }
  return true;
}

// Preparar payload según la especificación
const preparePayload = () => {
  const roleValue = formData.value.roles?.[0] || selectedRoleType.value?.roleValue || 'rector';
  
  const payload = {
    names: formData.value.names.trim(),
    lastNames: formData.value.lastNames.trim(),
    email: formData.value.email.trim(),
    cellphone: formData.value.cellphone.trim(),
    direction: formData.value.direction.trim(),
    dateBorn: formData.value.dateBorn,
    gender: formData.value.gender,
    stratum: parseInt(formData.value.stratum),
    sisben: formData.value.sisben.trim(),
    eps: formData.value.eps.trim(),
    typeBlood: formData.value.typeBlood,
    victimPopulation: formData.value.victimPopulation || false,
    disability: formData.value.disability.trim(),
    ethnic: formData.value.ethnic.trim(),
  };
  
  if (!isEditMode.value) {
    payload.typeDocument = formData.value.typeDocument;
    payload.numberDocument = formData.value.numberDocument.trim();
    payload.password = formData.value.password;
    payload.roles = roleValue;
    payload.college = formData.value.college;
    payload.profilePhoto = formData.value.profilePhoto?.trim() || '';
    payload.signDigital = '';
  } else {
    if (formData.value.profilePhoto !== undefined) {
      payload.profilePhoto = formData.value.profilePhoto?.trim() || '';
    }
  }
  
  return payload;
}

// Enviar formulario
const submitForm = async () => {
  if (!validateForm()) return;
  
  try {
    isSaving.value = true;
    const payload = preparePayload();
    
    if (isEditMode.value) {
      try {
        await updateUser(editingItem.value._id, payload);
        info({
          message: 'Usuario actualizado correctamente',
          position: 'top'
        });
      } catch (updateError) {
        if (updateError.response?.status === 404) {
          error({
            message: 'Error: El endpoint PUT /api/users/:id no está disponible en el backend.',
            position: 'top'
          });
          return;
        }
        const errorMsg = updateError.response?.data?.message || updateError.response?.data?.msg || updateError.message || 'Error al actualizar el usuario';
        error({
          message: errorMsg,
          position: 'top'
        });
        return;
      }
    } else {
      try {
        const result = await createUser(payload);
        const message = typeof result === 'string' ? result : (result?.message || 'Usuario creado correctamente');
        info({
          message: message,
          position: 'top'
        });
      } catch (createError) {
        const errorMsg = createError.response?.data?.message || createError.response?.data?.msg || createError.message || 'Error al crear el usuario';
        error({
          message: errorMsg,
          position: 'top'
        });
        return;
      }
    }
    
    await fetchUsers();
    closeDialog();
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Error al procesar la solicitud';
    error({
      message: errorMsg,
      position: 'top'
    });
  } finally {
    isSaving.value = false;
  }
}

// Cargar datos al montar
onMounted(async () => {
  await fetchUsers();
});
</script>

<style scoped>
.actionButtonContainer {
  margin-left: auto;
}

.pageHeaderInfo {
  padding: 0;
}

.pageTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1976d2;
}

.loadingMessage {
  margin-top: 10px;
  color: #666;
}

.delete-dialog-card {
  border-radius: 8px;
}

.dialog-card {
  border-radius: 8px;
}

.shadow1 {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}
</style>