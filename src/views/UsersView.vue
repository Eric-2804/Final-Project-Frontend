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
                              val => !val || /^\d+$/.test(val) || 'Solo números',
                              val => !val || val.length >= 10 || 'Mínimo 10 números'
                            ]"
                            hint="Mínimo 10 números. No se puede cambiar al editar"
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
                                    Nivel Colegio
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

                    <!-- Sección: Información Administrativa - Solo para roles que lo requieren -->
                    <div class="q-mb-md" v-if="needsCollege">
                      <div class="text-subtitle2 text-primary q-mb-sm">
                        <q-icon name="business" class="q-mr-xs" />
                        Información Institucional
                      </div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <q-select
                            v-if="collegeOptions.length > 0"
                            v-model="formData.college"
                            :options="collegeOptions"
                            label="Colegio *"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="needsCollege ? [val => !!val || 'Campo requerido'] : []"
                            @update:model-value="onCollegeChange"
                            :loading="loadingColleges"
                            :disable="isEditMode"
                            :hint="isEditMode ? 'No se puede cambiar al editar' : ''"
                            use-input
                            input-debounce="0"
                            @filter="filterColleges"
                            :options-filter="(options, searchTerm) => options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || opt.value.toString().includes(searchTerm))"
                            clearable
                          >
                            <template v-slot:no-option>
                              <q-item>
                                <q-item-section class="text-grey">
                                  No se encontraron coincidencias
                                </q-item-section>
                              </q-item>
                            </template>
                            <template v-slot:option="scope">
                              <q-item v-bind="scope.itemProps">
                                <q-item-section>
                                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                                  <q-item-label caption>ID: {{ scope.opt.value }}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                          
                          <q-input
                            v-else
                            v-model="formData.college"
                            label="ID del Colegio *"
                            outlined
                            dense
                            :rules="needsCollege ? [
                              val => !!val || 'Campo requerido',
                              val => /^[0-9a-fA-F]{24}$/.test(val) || 'Debe ser un ID válido (24 caracteres hexadecimales)'
                            ] : []"
                            :loading="loadingColleges"
                            :disable="isEditMode"
                            :hint="isEditMode ? 'No se puede cambiar al editar' : 'Ingrese el ID del colegio'"
                            placeholder="Ejemplo: 507f1f77bcf86cd799439011"
                          >
                            <template v-slot:prepend>
                              <q-icon name="school" />
                            </template>
                            <template v-slot:append v-if="loadingColleges">
                              <q-spinner size="20px" />
                            </template>
                          </q-input>
                          
                          <div v-if="collegeOptions.length === 0 && !loadingColleges" class="text-caption text-warning q-mt-xs q-ml-sm">
                            <q-icon name="warning" size="xs" class="q-mr-xs" />
                            No se pudieron cargar los colegios. Por favor, ingrese el ID del colegio manualmente.
                        </div>
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
                        <span v-if="!requiresAdditionalInfo" class="text-caption text-grey-6 q-ml-sm">
                          (Opcional para usuarios administrativos)
                        </span>
                      </div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.stratum"
                            :options="stratumOptions"
                            :label="requiresAdditionalInfo ? 'Estratum *' : 'Estratum'"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="requiresAdditionalInfo ? [val => !!val || 'Campo requerido'] : []"
                            hint="Requerido para estudiantes y acudientes"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-input 
                            v-model="formData.sisben" 
                            :label="requiresAdditionalInfo ? 'SISBEN *' : 'SISBEN'"
                            outlined
                            dense
                            :rules="requiresAdditionalInfo ? [val => (val && val.trim() && val.trim() !== 'N/A') || 'Campo requerido'] : []"
                            hint="Requerido para estudiantes y acudientes"
                            @update:model-value="() => {}"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-input 
                            v-model="formData.eps" 
                            :label="requiresAdditionalInfo ? 'EPS *' : 'EPS'"
                            outlined
                            dense
                            :rules="requiresAdditionalInfo ? [val => (val && val.trim() && val.trim() !== 'N/A') || 'Campo requerido'] : []"
                            hint="Requerido para estudiantes y acudientes"
                            @update:model-value="() => {}"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.typeBlood"
                            :options="typeBloodOptions"
                            :label="requiresAdditionalInfo ? 'Tipo de Sangre *' : 'Tipo de Sangre'"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="requiresAdditionalInfo ? [val => !!val || 'Campo requerido'] : []"
                            hint="Requerido para estudiantes y acudientes"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-toggle
                            v-model="formData.victimPopulation"
                            :label="requiresAdditionalInfo ? 'Población Víctima *' : 'Población Víctima'"
                            color="primary"
                            left-label
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.disability"
                            :options="disabilityOptions"
                            :label="requiresAdditionalInfo ? 'Discapacidad *' : 'Discapacidad'"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="requiresAdditionalInfo ? [val => !!val || 'Campo requerido'] : []"
                            hint="Requerido para estudiantes y acudientes"
                          />
                        </div>

                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="formData.ethnic"
                            :options="ethnicOptions"
                            :label="requiresAdditionalInfo ? 'Etnia *' : 'Etnia'"
                            outlined
                            dense
                            emit-value
                            map-options
                            :rules="requiresAdditionalInfo ? [val => !!val || 'Campo requerido'] : []"
                            hint="Requerido para estudiantes y acudientes"
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
import { ref, onMounted, computed, nextTick } from "vue"
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
  { label: 'Rector', value: 'rector', roleValue: 'rector', needsHeadquarters: false, needsCollege: true, description: 'Asignado a nivel de Colegio' },
  { label: 'Secretaria', value: 'secretaria', roleValue: 'secretaria', needsHeadquarters: true, needsCollege: true, description: 'Asignada a nivel de Sede' },
  { label: 'Coordinador', value: 'coordinador', roleValue: 'coordinador', needsHeadquarters: true, needsCollege: true, description: 'Asignado a nivel de Sede' },
  { label: 'Profesor', value: 'profesor', roleValue: 'profesor', needsHeadquarters: false, needsCollege: true, description: 'Asignado a nivel de Colegio' },
  { label: 'Estudiante', value: 'estudiante', roleValue: 'estudiante', needsHeadquarters: false, needsCollege: true, description: 'Asignado a nivel de Colegio' },
  { label: 'Acudiente', value: 'acudiente', roleValue: 'acudiente', needsHeadquarters: false, needsCollege: false, description: 'No requiere asignación institucional' },
];

// Variable para mantener el objeto completo del tipo seleccionado
const selectedRoleTypeValue = ref(null);

// Roles permitidos - todos los roles del sistema
const allowedRoles = ['secretaria', 'coordinador', 'rector', 'profesor', 'estudiante', 'acudiente'];

// Opciones de roles para el filtro
const roleOptions = [
  { label: 'Secretaria', value: 'secretaria' },
  { label: 'Coordinador', value: 'coordinador' },
  { label: 'Rector', value: 'rector' },
  { label: 'Profesor', value: 'profesor' },
  { label: 'Estudiante', value: 'estudiante' },
  { label: 'Acudiente', value: 'acudiente' },
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
const loadingColleges = ref(false)
const selectedRoleType = ref(null)
const previewPhoto = ref(false)

// Verificar permisos según rol
const userRole = computed(() => authStore.user?.rol)
const canCreate = computed(() => userRole.value === 'secretaria')
const canEdit = computed(() => userRole.value === 'secretaria')

// Obtener el colegio del usuario actual si está disponible
const currentUserCollege = computed(() => {
  const user = authStore.user;
  if (user?.college) {
    if (typeof user.college === 'string') {
      return user.college;
    } else if (user.college?._id) {
      return user.college._id;
    } else if (user.college?.id) {
      return user.college.id;
    }
  }
  return null;
});


// Determinar si necesita selector de colegio
const needsCollege = computed(() => {
  return selectedRoleType.value?.needsCollege !== false; // Por defecto true, excepto para acudiente
});

// Determinar si los campos de información adicional son requeridos según el rol
const requiresAdditionalInfo = computed(() => {
  const role = selectedRoleType.value?.roleValue || formData.value.roles?.[0];
  const adminRoles = ['rector', 'secretaria', 'coordinador', 'profesor'];
  return !adminRoles.includes(role);
});

// Funciones helper para roles
const getRoleLabel = (rol) => {
  const roleMap = {
    secretaria: 'Secretaria',
    coordinador: 'Coordinador',
    rector: 'Rector',
    profesor: 'Profesor',
    estudiante: 'Estudiante',
    acudiente: 'Acudiente',
  };
  return roleMap[rol] || rol;
};

const getRoleIcon = (rol) => {
  const iconMap = {
    secretaria: 'admin_panel_settings',
    coordinador: 'supervisor_account',
    rector: 'school',
    profesor: 'person_outline',
    estudiante: 'school',
    acudiente: 'family_restroom',
  };
  return iconMap[rol] || 'person';
};

const getRoleColor = (rol) => {
  const colorMap = {
    secretaria: 'purple',
    coordinador: 'blue',
    rector: 'indigo',
    profesor: 'teal',
    estudiante: 'green',
    acudiente: 'orange',
  };
  return colorMap[rol] || 'grey';
};



// Helper para extraer ID y nombre de colegio
const extractCollegeInfo = (college) => {
  if (!college) return { id: null, name: 'Colegio' };
  
  const id = typeof college === 'string' 
    ? college 
    : (college._id || college.id || null);
  
  const name = typeof college === 'object'
    ? (college.name || college.nameSchool || college.nombre || 'Colegio')
    : 'Colegio';
  
  return { id, name };
};

// Cargar colegios disponibles
const fetchColleges = async () => {
  try {
    loadingColleges.value = true;
    collegeOptions.value = [];
    
    // Obtener colegio del usuario actual
    let userCollegeInfo = extractCollegeInfo(authStore.user?.college);
    let userCollegeId = currentUserCollege.value || userCollegeInfo.id;
    let userCollegeName = userCollegeInfo.name;
    
    // Si no hay colegio en el store, intentar obtenerlo del endpoint
    if (!userCollegeId && authStore.user?._id) {
      try {
        const userData = await getUserById(authStore.user._id);
        const fullUser = userData?.data || userData || authStore.user;
        if (fullUser.college) {
          userCollegeInfo = extractCollegeInfo(fullUser.college);
          userCollegeId = userCollegeInfo.id;
          userCollegeName = userCollegeInfo.name;
        }
      } catch (userError) {
        // Continuar sin el colegio del endpoint
      }
    }
    
    // Inicializar con el colegio del usuario actual si está disponible
    if (userCollegeId) {
      collegeOptions.value = [{
        label: userCollegeName,
        value: userCollegeId
      }];
    }
    
    // Intentar obtener más colegios desde /api/headquarters
    try {
      const { HEADQUARTERS } = API_ENDPOINTS;
      const response = await getData(HEADQUARTERS.BASE || '/api/headquarters');
      
      if (response?.headquarters && Array.isArray(response.headquarters)) {
        const schoolsMap = new Map();
        
        // Agregar el colegio del usuario actual primero
        if (userCollegeId) {
          schoolsMap.set(userCollegeId, {
            _id: userCollegeId,
            name: userCollegeName,
            nameSchool: userCollegeName,
            nombre: userCollegeName
          });
        }
        
        // Agregar colegios de las sedes
        response.headquarters.forEach(hq => {
          if (hq.school) {
            const schoolInfo = extractCollegeInfo(hq.school);
            if (schoolInfo.id && !schoolsMap.has(schoolInfo.id)) {
              schoolsMap.set(schoolInfo.id, {
                _id: schoolInfo.id,
                name: schoolInfo.name
              });
            }
          }
        });
        
        if (schoolsMap.size > 0) {
          collegeOptions.value = Array.from(schoolsMap.values())
            .map(school => ({
              label: school.name || 'Colegio',
              value: school._id
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        }
      }
    } catch (headquartersError) {
      // Continuar con el colegio del usuario si está disponible
    }
    
    if (collegeOptions.value.length === 0) {
      if (userCollegeId) {
        collegeOptions.value = [{
          label: userCollegeName || 'Colegio',
          value: userCollegeId
        }];
      } else {
        // Intentar usar localStorage como fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.college) {
              const collegeInfo = extractCollegeInfo(parsedUser.college);
              if (collegeInfo.id) {
                collegeOptions.value = [{
                  label: 'Colegio',
                  value: collegeInfo.id
                }];
              }
            }
          } catch (e) {
            // Ignorar errores de parsing
          }
        }
      }
    }
    
  } catch (err) {
    // Fallback final
    const collegeInfo = extractCollegeInfo(authStore.user?.college);
    if (collegeInfo.id) {
      collegeOptions.value = [{
        label: collegeInfo.name,
        value: collegeInfo.id
      }];
    }
  } finally {
    loadingColleges.value = false;
  }
};


// Manejar cambio de tipo de rol
const onRoleTypeChange = async (roleTypeValue) => {
  const roleType = roleTypeOptions.find(r => r.value === roleTypeValue);
  if (roleType) {
    selectedRoleType.value = roleType;
    formData.value.roles = [roleType.roleValue];
    
    const adminRoles = ['rector', 'secretaria', 'coordinador', 'profesor'];
    const isAdminRole = adminRoles.includes(roleType.roleValue);
    
    if (isAdminRole) {
      formData.value.stratum = formData.value.stratum || 3;
      formData.value.sisben = 'N/A';
      formData.value.eps = 'N/A';
      formData.value.typeBlood = formData.value.typeBlood || 'O+';
      formData.value.disability = formData.value.disability || 'NINGUNA';
      formData.value.ethnic = formData.value.ethnic || 'NINGUNA';
    } else {
      if (formData.value.sisben === 'N/A' || !formData.value.sisben) {
        formData.value.sisben = '';
      }
      if (formData.value.eps === 'N/A' || !formData.value.eps) {
        formData.value.eps = '';
      }
    }
    
    await nextTick();
  } else {
    selectedRoleType.value = null;
  }
};

// Manejar cambio de colegio
const onCollegeChange = () => {
  // No se requiere acción adicional
};

// Filtrar colegios en el selector
const filterColleges = (val, update) => {
  // Permitir que el usuario ingrese un ID manualmente si no hay opciones
  if (collegeOptions.value.length === 0 && val && val.trim()) {
    // Si el usuario ingresa un ID válido (MongoId), permitirlo
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    if (mongoIdRegex.test(val.trim())) {
      update(() => {
        collegeOptions.value = [{
          label: `Colegio (ID: ${val.trim()})`,
          value: val.trim()
        }];
      });
      return;
    }
  }
  update();
};

// Manejar error de imagen
const handleImageError = () => {
<<<<<<< HEAD

=======
  // El placeholder se mostrará automáticamente
>>>>>>> fdd1feb082c60f9ae6e2b5ad40376aad18400723
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

// Enriquecer usuarios con información de colegio
const enrichUsers = async (users) => {
  try {
    // Intentar obtener colegios desde /api/headquarters (puede fallar con 401)
    let normalizedSchools = [];
    
    try {
      const { HEADQUARTERS } = API_ENDPOINTS;
      const response = await getData(HEADQUARTERS.BASE || '/api/headquarters');
      
      if (response?.headquarters && Array.isArray(response.headquarters)) {
        // Extraer colegios únicos de las sedes
        const schoolsMap = new Map();
        
        response.headquarters.forEach(hq => {
          if (hq.school) {
            const schoolId = typeof hq.school === 'object' ? hq.school._id : hq.school;
            const schoolName = typeof hq.school === 'object' 
              ? (hq.school.name || hq.school.nameSchool || hq.school.nombre)
              : null;
            
            if (schoolId && !schoolsMap.has(schoolId)) {
              schoolsMap.set(schoolId, {
                _id: schoolId,
                name: schoolName || 'Colegio',
                nameSchool: schoolName,
                nombre: schoolName
              });
            }
          }
        });
        
        normalizedSchools = Array.from(schoolsMap.values());
      }
    } catch (error) {
      // Si falla, continuar sin enriquecer (no es crítico para la visualización)
    }
    
    let enrichedUsers = users.map(user => {
      const collegeId = typeof user.college === 'string' ? user.college : (user.college?._id || user.college?.id || null);
      const school = normalizedSchools.find(s => s._id === collegeId);
      
      return {
        ...user,
        collegeInfo: school || null
      };
    });
    
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
      };
    });
  } catch (error) {
    return users.map(user => {
      const role = user.rol || user.roles?.[0];
      return {
        ...user,
        fullName: `${user.names || ''} ${user.lastNames || ''}`.trim(),
        document: user.typeDocument ? `${user.typeDocument}: ${user.numberDocument || ''}` : (user.numberDocument || ''),
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

// Enriquecer un usuario individual con información de colegio
const enrichSingleUser = (user) => {
  const collegeInfo = extractCollegeInfo(user.college);
  return {
    ...user,
    collegeInfo: user.collegeInfo || (typeof user.college === 'object' ? user.college : null),
    college: collegeInfo.id || user.college
  };
};

// Abre el diálogo para editar
const handleEdit = async (user) => {
  try {
    isEditMode.value = true;
    editingItem.value = user;
    
    selectedRoleType.value = null;
    selectedRoleTypeValue.value = null;
    
    // 1. Obtener datos del backend
    const userData = await getUserById(user._id);
    let fullUser = userData?.data || userData || user;
    
    // 2. Enriquecer con información de colegio
    // Usar el usuario de la lista que ya tiene información enriquecida si está disponible
    if (user.collegeInfo) {
      fullUser = { ...fullUser, ...user };
    } else {
      // Si no, intentar enriquecer desde cero
      fullUser = await enrichSingleUser(fullUser);
    }
    
    const userRole = Array.isArray(fullUser.roles) ? fullUser.roles[0] : (fullUser.rol || fullUser.roles || 'rector');
    
    // 3. Obtener ID del colegio
    const collegeId = typeof fullUser.college === 'string' 
      ? fullUser.college 
      : (fullUser.college?._id || fullUser.college?.id || fullUser.collegeInfo?._id || '');
    
    // Cargar colegios solo si el rol lo requiere
    const roleType = roleTypeOptions.find(r => r.roleValue === userRole || r.value === userRole);
    if (roleType?.needsCollege !== false) {
      try {
        await fetchColleges();
      } catch (err) {
        // El error ya se maneja en fetchColleges, continuar con la edición
      }
    }
    
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
      signDigital: fullUser.signDigital || fullUser.firmaDisignDigitalgital || '',
    };
    
    // Buscar el tipo de rol en las opciones disponibles o crear uno genérico
    let finalRoleType = roleType;
    if (!finalRoleType && userRole) {
      const needsCollegeForRole = userRole !== 'acudiente';
      
      finalRoleType = {
        label: getRoleLabel(userRole),
        value: userRole,
        roleValue: userRole,
        needsCollege: needsCollegeForRole,
        description: 'Usuario del sistema'
      };
    }
    
    if (finalRoleType) {
      selectedRoleType.value = finalRoleType;
      selectedRoleTypeValue.value = finalRoleType.value;
      
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
  
  // Determinar valores por defecto según el rol
  const adminRoles = ['rector', 'secretaria', 'coordinador', 'profesor'];
  const isAdminRole = adminRoles.includes(defaultRoleType.roleValue);
  
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
    roles: [defaultRoleType.roleValue],
    password: '',
    confirmPassword: '',
    // Para roles administrativos, establecer valores por defecto (aunque sean opcionales visualmente)
    // Para estudiantes y acudientes, dejar vacíos para que el usuario los complete
    stratum: isAdminRole ? 3 : '',
    sisben: isAdminRole ? 'N/A' : '',
    eps: isAdminRole ? 'N/A' : '',
    typeBlood: 'O+',
    victimPopulation: false,
    disability: 'NINGUNA',
    ethnic: 'NINGUNA',
    profilePhoto: '',
    signDigital: '',
    _id: null,
  };
  
  // Cargar colegios siempre (el backend lo requiere para todos los usuarios)
  await fetchColleges();
  
  // Pre-seleccionar el colegio del usuario actual si está disponible y no hay selección previa
  if (collegeOptions.value.length > 0 && !formData.value.college && currentUserCollege.value) {
    // Verificar si el colegio del usuario está en las opciones
    const userCollegeExists = collegeOptions.value.some(opt => opt.value === currentUserCollege.value);
    if (userCollegeExists) {
      formData.value.college = currentUserCollege.value;
    }
  }
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
  // Validar colegio solo si el rol lo requiere
  if (needsCollege.value && !formData.value.college) {
    error({ message: 'Debe seleccionar un colegio', position: 'top' });
    return false;
  }
  
  // Validar campos de información adicional solo si son requeridos según el rol
  const role = formData.value.roles?.[0] || selectedRoleType.value?.roleValue;
  const adminRoles = ['rector', 'secretaria', 'coordinador', 'profesor'];
  const isAdminRole = adminRoles.includes(role);
  
  if (!isAdminRole) {
    // Para estudiantes y acudientes, estos campos son requeridos
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
  
  // Determinar si es un rol administrativo
  const adminRoles = ['rector', 'secretaria', 'coordinador', 'profesor'];
  const isAdminRole = adminRoles.includes(roleValue);
  
  // Validar que stratum sea un número válido
  let stratumValue = formData.value.stratum;
  if (stratumValue) {
    stratumValue = parseInt(stratumValue);
    if (isNaN(stratumValue)) {
      stratumValue = isAdminRole ? 3 : null;
    }
  } else {
    stratumValue = isAdminRole ? 3 : null;
  }
  
  const payload = {
    names: formData.value.names.trim(),
    lastNames: formData.value.lastNames.trim(),
    email: formData.value.email.trim(),
    cellphone: formData.value.cellphone.trim(),
    direction: formData.value.direction.trim(),
    dateBorn: formData.value.dateBorn,
    gender: formData.value.gender,
    // Para roles administrativos, usar valores por defecto si no se proporcionan
    // El backend los requiere, así que siempre debemos enviarlos
    // IMPORTANTE: El backend valida que estos campos no estén vacíos
    // El backend valida con .notEmpty().escape() que espera un string
    // Pero el modelo es Number, Mongoose lo convertirá automáticamente
    stratum: String(stratumValue || (isAdminRole ? 3 : 1)),
    sisben: (formData.value.sisben?.trim() || 'N/A'), // Backend requiere no vacío
    eps: (formData.value.eps?.trim() || 'N/A'), // Backend requiere no vacío
    typeBlood: formData.value.typeBlood || 'O+', // Asegurar valor por defecto
    victimPopulation: formData.value.victimPopulation !== undefined ? Boolean(formData.value.victimPopulation) : false,
    disability: (formData.value.disability?.trim() || 'NINGUNA'), // Backend requiere no vacío
    ethnic: (formData.value.ethnic?.trim() || 'NINGUNA'), // Backend requiere no vacío
  };
  
  if (!isEditMode.value) {
    // Campos solo para creación
    payload.typeDocument = formData.value.typeDocument;
    payload.numberDocument = formData.value.numberDocument.trim();
    payload.password = formData.value.password;
    // Enviar roles como string (el backend lo acepta así según validaciones)
    // Aunque el modelo es array, Mongoose puede convertir string a array
    payload.roles = roleValue;
    
    // PROBLEMA: El backend SIEMPRE requiere college (validationsRegister línea 43)
    // Asegurar que siempre se envíe un colegio
    if (formData.value.college) {
      // Si hay un colegio seleccionado, usarlo
      payload.college = formData.value.college;
    } else {
      // Si no hay colegio seleccionado, usar el colegio del usuario actual como fallback
      const fallbackCollege = currentUserCollege.value || 
                             (typeof authStore.user?.college === 'string' 
                               ? authStore.user.college 
                               : (authStore.user?.college?._id || authStore.user?.college?.id));
      
      if (fallbackCollege) {
        payload.college = fallbackCollege;
      } else {
        // Si no hay fallback, intentar desde localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.college) {
              const defaultCollegeId = typeof parsedUser.college === 'string' 
                ? parsedUser.college 
                : (parsedUser.college._id || parsedUser.college.id);
              if (defaultCollegeId) {
                payload.college = defaultCollegeId;
              }
            }
          } catch (e) {
            // Ignorar errores de parsing
          }
        }
      }
    }
    
    // El backend requiere que estos campos no estén vacíos
    payload.profilePhoto = formData.value.profilePhoto?.trim() || 'https://via.placeholder.com/150';
    payload.signDigital = formData.value.signDigital?.trim() || 'https://via.placeholder.com/150';
  } else {
    // Para edición, solo incluir campos que se pueden actualizar
    if (formData.value.profilePhoto !== undefined) {
      payload.profilePhoto = formData.value.profilePhoto?.trim() || '';
    }
    // Incluir roles si se necesita actualizar (aunque normalmente no se cambia)
    if (formData.value.roles && formData.value.roles.length > 0) {
      payload.roles = formData.value.roles[0];
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
        // Intentar actualizar usando PUT /api/users/:id
        await updateUser(editingItem.value._id, payload);
        info({
          message: 'Usuario actualizado correctamente',
          position: 'top'
        });
      } catch (updateError) {
        // Si el endpoint no existe (404) o método no permitido (405), informar al usuario
        if (updateError.response?.status === 404 || updateError.response?.status === 405) {
          error({
            message: 'La funcionalidad de edición no está disponible en el backend. Por favor, contacte al administrador.',
            position: 'top',
            timeout: 5000
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
        // Validar que todos los campos requeridos estén presentes antes de enviar
        if (!payload.college) {
          error({
            message: 'Error: El backend requiere un colegio para crear usuarios. Por favor, seleccione un colegio o ingrese el ID manualmente.',
            position: 'top',
            timeout: 5000
          });
          return;
        }
        
        // Validar que college sea un ObjectId válido
        const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!mongoIdRegex.test(payload.college)) {
          error({
            message: 'Error: El ID del colegio no es válido. Debe ser un ObjectId de MongoDB (24 caracteres hexadecimales).',
            position: 'top',
            timeout: 5000
          });
          return;
        }
        
        // Validar que los campos requeridos por el backend tengan valores válidos
        if (!payload.profilePhoto || payload.profilePhoto.trim() === '') {
          payload.profilePhoto = 'https://via.placeholder.com/150';
        }
        if (!payload.signDigital || payload.signDigital.trim() === '') {
          payload.signDigital = 'https://via.placeholder.com/150';
        }
        // stratum debe ser string para pasar .notEmpty().escape(), Mongoose lo convertirá a Number
        if (!payload.stratum || payload.stratum === '') {
          payload.stratum = String(isAdminRole ? 3 : 1);
        } else if (typeof payload.stratum !== 'string') {
          payload.stratum = String(payload.stratum);
        }
        if (!payload.sisben || payload.sisben.trim() === '') {
          payload.sisben = 'N/A';
        }
        if (!payload.eps || payload.eps.trim() === '') {
          payload.eps = 'N/A';
        }
        if (!payload.typeBlood || payload.typeBlood.trim() === '') {
          payload.typeBlood = 'O+';
        }
        // victimPopulation debe ser boolean para pasar .isBoolean()
        // El backend valida con .notEmpty().isBoolean() que es contradictorio
        // pero necesitamos enviarlo como boolean
        if (payload.victimPopulation === undefined || payload.victimPopulation === null) {
          payload.victimPopulation = false;
        } else {
          // Asegurar que sea boolean, no string "true"/"false"
          payload.victimPopulation = Boolean(payload.victimPopulation);
        }
        if (!payload.disability || payload.disability.trim() === '') {
          payload.disability = 'NINGUNA';
        }
        if (!payload.ethnic || payload.ethnic.trim() === '') {
          payload.ethnic = 'NINGUNA';
        }
        
        const result = await createUser(payload);
        
        // Mostrar mensaje de éxito
        info({
          message: 'Usuario creado exitosamente',
          position: 'top',
          timeout: 3000
        });
        
        // Recargar la lista de usuarios
        await fetchUsers();
        
        // Cerrar el diálogo
        closeDialog();
      } catch (createError) {
        // Mejorar manejo de errores para mostrar mensajes específicos
        let errorMsg = 'Error al crear el usuario';
        
        if (createError.response) {
          const status = createError.response.status;
          const data = createError.response.data;
          
          // Error 400: Validación fallida
          if (status === 400) {
            // Intentar extraer mensajes de error de diferentes formatos
            if (data?.message && typeof data.message === 'string') {
              errorMsg = `Error de validación: ${data.message}`;
            } else if (data?.msg && typeof data.msg === 'string') {
              errorMsg = `Error de validación: ${data.msg}`;
            } else if (data?.errors) {
              // Si hay errores de validación específicos
              let errorsArray = [];
              
              if (Array.isArray(data.errors)) {
                errorsArray = data.errors.map(err => {
                  if (typeof err === 'string') return err;
                  if (err?.msg) return err.msg;
                  if (err?.message) return err.message;
                  return JSON.stringify(err);
                });
              } else if (typeof data.errors === 'object') {
                // Si es un objeto, extraer los valores
                errorsArray = Object.entries(data.errors).map(([field, error]) => {
                  if (typeof error === 'string') return `${field}: ${error}`;
                  if (error?.msg) return `${field}: ${error.msg}`;
                  if (error?.message) return `${field}: ${error.message}`;
                  if (Array.isArray(error)) return `${field}: ${error.join(', ')}`;
                  return `${field}: ${JSON.stringify(error)}`;
                });
              }
              
              if (errorsArray.length > 0) {
                // Mejorar mensaje si es sobre número de documento
                let formattedErrors = errorsArray.map(err => {
                  if (err.toLowerCase().includes('numberdocument') || err.toLowerCase().includes('número de documento')) {
                    if (err.toLowerCase().includes('length') || err.toLowerCase().includes('longitud') || err.toLowerCase().includes('min')) {
                      return 'El número de documento debe tener al menos 10 dígitos según las validaciones del backend. Si su documento tiene menos dígitos, contacte al administrador.';
                    }
                  }
                  return err;
                });
                errorMsg = `Error de validación: ${formattedErrors.join('. ')}`;
              } else {
                errorMsg = 'Error de validación: Verifique que todos los campos requeridos estén completos.';
              }
            } else if (typeof data === 'string' && data.includes('college')) {
              errorMsg = 'Error: El colegio es requerido. Por favor, seleccione un colegio.';
            } else {
              errorMsg = 'Error de validación: Verifique que todos los campos requeridos estén completos y tengan el formato correcto.';
            }
          } 
          // Error 401: No autenticado
          else if (status === 401) {
            errorMsg = 'Error de autenticación: Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
          }
          // Error 500: Error del servidor
          else if (status === 500) {
            errorMsg = 'Error del servidor: Por favor, contacte al administrador.';
          }
          // Otros errores
          else {
            const msg = data?.message || data?.msg || data?.error;
            if (typeof msg === 'string') {
              errorMsg = msg;
            } else {
              errorMsg = `Error ${status}: ${createError.message || 'Error desconocido'}`;
            }
          }
        } else {
          errorMsg = createError.message || 'Error al crear el usuario';
        }
        
        error({
          message: errorMsg,
          position: 'top',
          timeout: 6000
        });
        return;
      }
    }
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