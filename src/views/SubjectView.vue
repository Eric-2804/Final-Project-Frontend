<template>
    <q-page class="q-pa-md">
      <div class="row q-col-gutter-md">
        <section class="col-12">
          <q-card class="shadow1">
            <q-card-section>
              <div v-if="isLoading" class="text-center q-pa-xl">
                <q-spinner size="50px" color="primary" />
                <div class="loadingMessage">Cargando materias y áreas...</div>
              </div>
  
              <div class="row items-center q-mb-lg">
                <q-card-section class="pageHeaderInfo">
                  <div class="pageTitle">
                    Gestión de Áreas y Materias
                  </div>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    Crear y gestionar las áreas y materias de la institución
                  </div>
                </q-card-section>
  
                <q-space />
                <div class="actionButtonContainer">
                  <q-btn 
                    v-if="canCreate" 
                    color="primary" 
                    icon="add" 
                    label="AGREGAR" 
                    @click="openCreateDialog" 
                  />
                </div>
              </div>
  
              <!-- Filtros -->
              <div class="row q-mb-md q-gutter-sm">
                <q-select
                  v-model="filterType"
                  :options="typeOptions"
                  label="Filtrar por tipo"
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
                          :name="scope.opt.value === 'area' ? 'folder' : 'book'" 
                          :color="scope.opt.value === 'area' ? 'blue' : 'green'"
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
                v-if="!isLoading && materiasAreasList.length > 0" 
                :rows="filteredRows" 
                :columns="columns" 
                :actions="canEdit"
                row-key="_id"
              >
                <template v-slot:body-cell-type="props">
                  <q-td :props="props">
                    <q-chip 
                      :color="props.value === 'area' ? 'blue' : 'green'" 
                      text-color="white" 
                      dense
                    >
                      {{ props.value === 'area' ? 'Área' : 'Materia' }}
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
                      {{ props.value ? 'Activa' : 'Inactiva' }}
                    </q-chip>
                  </q-td>
                </template>
  
  
                <template v-slot:body-cell-areaCode="props">
                  <q-td :props="props">
                    <!-- Si es una materia -->
                    <div v-if="props.row.type === 'materia'">
                      <!-- Si tiene areaCode con información completa (objeto con name y code) -->
                      <div v-if="props.value && typeof props.value === 'object' && props.value.code">
                        <div class="text-weight-medium text-blue-8">
                          {{ props.value.name || 'Área sin nombre' }}
                        </div>
                        <div class="text-caption text-grey-7 q-mt-xs">
                          Código: {{ props.value.code }}
                        </div>
                      </div>
                      <!-- Si tiene areaCode pero solo como string (fallback) -->
                      <div v-else-if="props.value && props.value !== '' && props.value !== null && typeof props.value === 'string'">
                        <q-chip 
                          color="blue-1" 
                          text-color="blue-8"
                          dense
                          size="sm"
                        >
                          {{ props.value }}
                        </q-chip>
                      </div>
                      <!-- Si no tiene areaCode, mostrar advertencia -->
                      <div v-else>
                        <q-chip 
                          color="orange-1" 
                          text-color="orange-8"
                          dense
                          size="sm"
                        >
                          <q-icon name="warning" size="xs" class="q-mr-xs" />
                          Sin área
                        </q-chip>
                      </div>
                    </div>
                    <!-- Si es un área, mostrar "No aplica" -->
                    <div v-else-if="props.row.type === 'area'">
                      <q-chip 
                        color="grey-3" 
                        text-color="grey-7"
                        dense
                        size="sm"
                      >
                        No aplica
                      </q-chip>
                    </div>
                    <!-- Fallback -->
                    <span v-else class="text-grey-6">-</span>
                  </q-td>
                </template>
  
                <template v-slot:body-cell-group="props">
                  <q-td :props="props">
                    <div v-if="props.value && (props.value.level || props.value.grade)">
                      <div class="text-weight-medium">
                        <q-icon name="group" size="xs" class="q-mr-xs" color="primary" />
                        <span v-if="props.value.level">{{ props.value.level }}</span>
                        <span v-if="props.value.level && props.value.grade"> - </span>
                        <span v-if="props.value.grade">{{ props.value.grade }}</span>
                      </div>
                    </div>
                    <div v-else class="text-grey-5">—</div>
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
                    No hay materias o áreas registradas
                  </div>
                </template>
              </Table>
              
              <div v-if="!isLoading && materiasAreasList.length === 0" class="text-center q-pa-xl">
                <q-icon name="inbox" size="64px" color="grey-5" />
                <div class="text-h6 q-mt-md text-grey-6">No hay datos disponibles</div>
                <div class="text-caption text-grey-6 q-mt-sm">No se encontraron materias o áreas registradas</div>
              </div>
  
              <!-- Diálogo de confirmación de eliminación -->
              <q-dialog v-model="showDeleteDialog" persistent>
                <q-card style="min-width: 380px; max-width: 450px" class="delete-dialog-card">
                  <q-card-section class="text-center q-pa-lg">
                    <q-icon name="delete_outline" size="64px" color="negative" class="q-mb-md" />
                    <div class="text-h6 q-mb-xs">¿Eliminar {{ itemToDelete?.type === 'area' ? 'área' : 'materia' }}?</div>
                    <div class="text-body2 text-grey-7 q-mb-md">
                      {{ itemToDelete?.name }}
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
  
              <!-- Diálogo de creación/edición -->
              <q-dialog v-model="showDialog" persistent>
                <q-card style="min-width: 520px; max-width: 90vw;">
                  <q-card-section class="row items-center q-pb-none dialogHeader">
                    <div class="text-h6">{{ isEditMode ? 'Editar' : 'Crear' }} {{ formData.type === 'area' ? 'Área' : 'Materia' }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense @click="closeDialog" />
                  </q-card-section>
  
                  <q-separator />
  
                  <q-card-section>
                    <q-form @submit.prevent="submitForm" ref="formRef">
                      <!-- Descripción contextual según el tipo -->
                      <q-banner 
                        :class="formData.type === 'area' ? 'bg-blue-1 text-blue-8' : 'bg-green-1 text-green-8'"
                        rounded
                        class="q-mb-md"
                      >
                        <template v-slot:avatar>
                          <q-icon 
                            :name="formData.type === 'area' ? 'folder' : 'book'" 
                            :color="formData.type === 'area' ? 'blue' : 'green'"
                            size="32px"
                          />
                        </template>
                        <div class="text-weight-medium q-mb-xs">
                          {{ isEditMode 
                            ? (formData.type === 'area' ? 'Editando un Área' : 'Editando una Materia')
                            : (formData.type === 'area' ? 'Creando un Área' : 'Creando una Materia')
                          }}
                        </div>
                        <div class="text-body2">
                          <span v-if="formData.type === 'area'">
                            Las <strong>áreas</strong> agrupan materias relacionadas. Ejemplo: "Ciencias Naturales" puede contener materias como "Biología", "Química" y "Física".
                            <span v-if="isEditMode" class="text-weight-medium"> Estás editando: <strong>{{ editingItem?.name }}</strong></span>
                          </span>
                          <span v-else>
                            Las <strong>materias</strong> son asignaturas específicas que pertenecen a un área. Ejemplo: "Matemáticas", "Español", "Historia".
                            <span v-if="isEditMode" class="text-weight-medium"> Estás editando: <strong>{{ editingItem?.name }}</strong></span>
                          </span>
                        </div>
                      </q-banner>
  
                      <!-- Sección: Información Básica -->
                      <div class="q-mb-md">
                        <div class="text-subtitle2 text-primary q-mb-sm">
                          <q-icon name="info" class="q-mr-xs" />
                          Información Básica
                        </div>
                        <div class="row q-col-gutter-md">
                          <div class="col-12">
                            <q-select
                              v-model="formData.type"
                              :options="typeOptions"
                              label="Tipo *"
                              outlined
                              emit-value
                              map-options
                              :rules="[val => !!val || 'El tipo es requerido']"
                              @update:model-value="onTypeChange"
                            >
                              <template v-slot:option="scope">
                                <q-item v-bind="scope.itemProps">
                                  <q-item-section avatar>
                                    <q-icon 
                                      :name="scope.opt.value === 'area' ? 'folder' : 'book'" 
                                      :color="scope.opt.value === 'area' ? 'blue' : 'green'"
                                    />
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
  
                          <div class="col-12 col-md-6">
                            <q-input 
                              v-model="formData.name" 
                              :label="formData.type === 'area' ? 'Nombre del Área *' : 'Nombre de la Materia *'"
                              outlined
                              :rules="[val => !!val || 'Nombre requerido']"
                              :hint="formData.type === 'area' ? 'Ej: Ciencias Naturales, Humanidades, Matemáticas' : 'Ej: Matemáticas, Español, Historia'"
                            />
                          </div>
  
                          <div class="col-12 col-md-6">
                            <q-input 
                              v-model="formData.code" 
                              :label="formData.type === 'area' ? 'Código del Área *' : 'Código de la Materia *'" 
                              outlined
                              :rules="[val => !!val || 'Código requerido']"
                              :hint="formData.type === 'area' 
                                ? 'Código único que identifica esta área (ej: 01, 02, 03). Este código será usado por las materias como su areaCode.' 
                                : 'Código único de esta materia (ej: BIO01, FIS02). El código del área se selecciona más abajo.'"
                            />
                          </div>
  
                        </div>
                      </div>
  
                      <q-separator class="q-my-md" />
  
                      <!-- Sección: Relaciones -->
                      <div class="q-mb-md">
                        <div class="text-subtitle2 text-primary q-mb-sm">
                          <q-icon name="link" class="q-mr-xs" />
                          Relaciones y Contexto
                        </div>
                        
                        <div class="row q-col-gutter-md">
  
                          <!-- Campo group: requerido para ambos tipos -->
                          <div class="col-12">
                            <q-select
                              v-model="formData.group"
                              :options="groupOptions"
                              label="Grupo *"
                              outlined
                              emit-value
                              map-options
                              :rules="[val => !!val || 'El grupo es requerido']"
                              hint="Selecciona el grupo al que pertenece esta materia/área. Los grupos se cargan del año actual."
                              :loading="groupOptions.length === 0"
                            >
                              <template v-slot:option="scope">
                                <q-item v-bind="scope.itemProps">
                                  <q-item-section avatar>
                                    <q-icon name="group" color="primary" />
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                                    <q-item-label caption v-if="scope.opt.level || scope.opt.grade">
                                      Nivel: {{ scope.opt.level || 'N/A' }} | Grado: {{ scope.opt.grade || 'N/A' }}
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                              </template>
                              <template v-slot:no-option>
                                <q-item>
                                  <q-item-section class="text-grey">
                                    No hay grupos disponibles. Debes crear grupos primero.
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
  
                          <!-- Campo específico para Materias -->
                          <div class="col-12" v-if="formData.type === 'materia'">
                            <q-select
                              v-model="formData.areaCode"
                              :options="areaOptions"
                              label="Área a la que pertenece *"
                              outlined
                              emit-value
                              map-options
                              :rules="[val => !!val || 'El código de área es requerido para materias']"
                              hint="Selecciona el área a la que pertenece esta materia. El código (code) del área seleccionada se usará como areaCode de esta materia."
                              :loading="areaOptions.length === 0"
                            >
                              <template v-slot:no-option>
                                <q-item>
                                  <q-item-section class="text-grey">
                                    No hay áreas disponibles. Debes crear un área primero.
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                            <div class="text-caption text-grey-7 q-mt-xs q-ml-sm">
                              <q-icon name="info" size="xs" class="q-mr-xs" />
                              El código del área seleccionada se usará como <strong>areaCode</strong> de esta materia.
                            </div>
                          </div>
  
                          <!-- Campo específico para Áreas -->
                          <div class="col-12" v-else>
                            <q-banner class="bg-blue-1 text-blue-8 q-mb-md" rounded>
                              <template v-slot:avatar>
                                <q-icon name="info" color="blue" />
                              </template>
                              <div class="text-body2">
                                <strong>Las áreas solo tienen código (code)</strong>
                              </div>
                              <div class="text-caption q-mt-xs">
                                El campo <strong>code</strong> es el que identifica esta área y será usado por las materias para asociarse a ella mediante su <strong>areaCode</strong>.
                              </div>
                            </q-banner>
                          </div>
                        </div>
                      </div>
  
                      <q-separator class="q-my-md" />
  
                      <!-- Sección: Configuración Adicional -->
                      <div class="q-mb-md">
                        <div class="text-subtitle2 text-primary q-mb-sm">
                          <q-icon name="settings" class="q-mr-xs" />
                          Configuración Adicional
                        </div>
                        
                        <div class="row q-col-gutter-md">
                          <!-- Campo independiente: Solo para materias -->
                          <div class="col-12" v-if="formData.type === 'materia'">
                            <q-toggle
                              v-model="formData.independent"
                              label="Materia Independiente"
                              color="primary"
                              :hint="formData.independent ? 'Esta materia es independiente (no pertenece a un área)' : 'Esta materia pertenece a un área'"
                              left-label
                            />
                            <div class="text-caption text-grey-7 q-mt-xs q-ml-sm">
                              <q-icon name="info" size="xs" class="q-mr-xs" />
                              Si está activado, la materia es independiente y no requiere un área asociada.
                            </div>
                          </div>
  
                          <!-- Campo incluir en estadísticas: Para materias y áreas -->
                          <div class="col-12">
                            <q-toggle
                              v-model="formData.includeInStatistics"
                              label="Incluir en Estadísticas"
                              color="green"
                              hint="Si está activado, esta materia/área se incluirá en los reportes estadísticos"
                              left-label
                            />
                            <div class="text-caption text-grey-7 q-mt-xs q-ml-sm">
                              <q-icon name="bar_chart" size="xs" class="q-mr-xs" />
                              Activa esta opción para incluir esta materia/área en los reportes y estadísticas del sistema.
                            </div>
                          </div>
                        </div>
                      </div>
  
  
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
                          :label="isEditMode ? 'Guardar cambios' : 'Crear'"
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
  import api from '../services/api.js';
  import { useAuthStore } from '../stores/auth.js';
  import Table from "../components/tables.vue"
  import { useNotify } from "../composables/useNotify.js"
  import {
    getAllMateriasAreas,
    createMateriaArea,
    updateMateriaArea,
    activateMateriaArea,
    desactivateMateriaArea,
    deleteMateriaArea
  } from '../services/subjectService.js';
  
  const { showNotify: info, showErrorNotify: error } = useNotify()
  
  const isLoading = ref(false)
  const materiasAreasList = ref([])
  const showDialog = ref(false)
  const isEditMode = ref(false)
  const editingItem = ref(null)
  const authStore = useAuthStore();
  const filterType = ref(null)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const isToggling = ref(false)
  const togglingItemId = ref(null)
  const showDeleteDialog = ref(false)
  const itemToDelete = ref(null)
  
  const formData = ref({
    group: '', // ID del grupo (MongoID)
    name: '',
    code: '',
    type: 'materia', // materia | area
    areaCode: '',
    independent: false, // Solo para materias
    includeInStatistics: true, // Para materias y áreas
  })
  
  const groupOptions = ref([]) // Opciones para el select de grupos
  const areaOptions = ref([]) // Opciones para el select de áreas
  const areaMap = ref(new Map()) // Mapa de áreas: code -> {name, code} para búsqueda rápida
  
  const typeOptions = [
    { label: 'Materia', value: 'materia' },
    { label: 'Área', value: 'area' }
  ]
  
  
  // Verificar permisos según rol
  const userRole = computed(() => authStore.user?.rol)
  const canCreate = computed(() => userRole.value === 'secretaria')
  const canEdit = computed(() => userRole.value === 'secretaria')
  
  // Cargar grupos filtrados por año
  const fetchGroups = async (year = null) => {
    try {
      const currentYear = year || new Date().getFullYear();
      const response = await api.get(`/api/groups/year/${currentYear}`);
      const res = response.data;
      
      let items = [];
      if (Array.isArray(res)) {
        items = res;
      } else if (Array.isArray(res?.data)) {
        items = res.data;
      } else if (Array.isArray(res?.groups)) {
        items = res.groups;
      }
      
      groupOptions.value = items.map(g => {
        const level = g.level || '';
        const grade = g.grade || '';
        const displayName = level && grade ? `${level} - ${grade}` : (level || grade || 'Grupo sin nombre');
        
        return {
          label: displayName,
          value: g._id || g.id,
          level,
          grade,
          _id: g._id || g.id
        };
      });
    } catch (err) {
      error({
        message: err.response?.data?.msg || err.response?.data?.message || 'No se pudieron cargar los grupos',
        position: 'top'
      });
    }
  }
  
  // Cargar áreas para el selector
  const fetchAreas = async () => {
    try {
      const response = await api.get('/api/subjects?type=area');
      const res = response.data;
      
      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res?.data)) {
        data = res.data;
      } else if (Array.isArray(res?.subjects)) {
        data = res.subjects;
      }
      
      const areas = data.filter(item => item.type === 'area' && (item.isActive !== false && item.active !== false));
      
      areaOptions.value = areas.map(a => ({ 
        label: `${a.code} - ${a.name}`, 
        value: a.code
      }));
      
      areaMap.value = new Map();
      areas.forEach(a => {
        areaMap.value.set(a.code, {
          name: a.name || '',
          code: a.code || ''
        });
      });
    } catch (err) {
      // Error silencioso - no es crítico para la funcionalidad principal
    }
  }
  
  // Listar materias y áreas
  const fetchMateriasAreas = async () => {
    try {
      isLoading.value = true;
      const response = await api.get('/api/subjects');
      const res = response.data;
      
      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res?.data)) {
        data = res.data;
      } else if (Array.isArray(res?.subjects)) {
        data = res.subjects;
      }
      
      materiasAreasList.value = data.map(item => {
        let groupDisplay = null;
        if (item.group) {
          if (typeof item.group === 'object' && item.group !== null) {
            groupDisplay = {
              _id: item.group._id || item.group.id || null,
              level: item.group.level || null,
              grade: item.group.grade || null
            };
          } else if (typeof item.group === 'string') {
            const groupOption = groupOptions.value.find(g => g.value === item.group || g._id === item.group);
            groupDisplay = groupOption ? {
              _id: item.group,
              level: groupOption.level || null,
              grade: groupOption.grade || null
            } : {
              _id: item.group,
              level: null,
              grade: null
            };
          }
        }
        
        let areaCodeDisplay = null;
        if (item.type === 'materia' && item.areaCode && item.areaCode !== '') {
          const areaCodeValue = String(item.areaCode).trim();
          const areaInfo = areaMap.value.get(areaCodeValue);
          areaCodeDisplay = {
            code: areaCodeValue,
            name: areaInfo?.name || null
          };
        }
        
        return {
          ...item,
          group: groupDisplay,
          areaCode: areaCodeDisplay,
          active: item.active !== undefined ? item.active : (item.isActive !== undefined ? item.isActive : true)
        };
      });
    } catch (err) {
      error({
        message: err.response?.data?.msg || err.response?.data?.message || "No se pudieron cargar las materias y áreas",
        position: 'top'
      });
    } finally {
      isLoading.value = false;
    }
  }
  
  // Validar formulario
  const validateForm = () => {
    if (!formData.value.group) {
      error({ message: 'El grupo es requerido', position: 'top' });
      return false;
    }
    if (!formData.value.name?.trim()) {
      error({ message: 'El nombre es requerido', position: 'top' });
      return false;
    }
    if (!formData.value.code?.trim()) {
      error({ message: 'El código es requerido', position: 'top' });
      return false;
    }
    if (!formData.value.type) {
      error({ message: 'El tipo es requerido', position: 'top' });
      return false;
    }
    if (formData.value.type === 'materia' && !formData.value.areaCode) {
      error({ message: 'El código de área es requerido para materias', position: 'top' });
      return false;
    }
    return true;
  }
  
  // Preparar payload según el tipo
  const preparePayload = () => {
    const finalAreaCode = formData.value.type === 'materia' 
      ? formData.value.areaCode 
      : formData.value.code.trim();
    
    return {
      group: formData.value.group,
      name: formData.value.name.trim(),
      code: formData.value.code.trim(),
      type: formData.value.type,
      areaCode: finalAreaCode,
      independent: formData.value.type === 'materia' ? formData.value.independent : false,
      includeInStatistics: formData.value.includeInStatistics
    };
  }
  
  // Extraer mensaje de error del backend
  const extractErrorMessage = (err, defaultMsg) => {
    if (err.response?.data) {
      const errorData = err.response.data;
      if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        return errorData.errors.map(e => {
          if (typeof e === 'string') return e;
          if (e.msg) return e.msg;
          if (e.message) return e.message;
          if (e.param && e.msg) return `${e.param}: ${e.msg}`;
          return JSON.stringify(e);
        }).join(', ');
      }
      return errorData.msg || errorData.message || (typeof errorData === 'string' ? errorData : defaultMsg);
    }
    return err.message || defaultMsg;
  }
  
  // Crear nueva materia/área
  const createMateria = async () => {
    try {
      isSaving.value = true;
      
      if (!validateForm()) {
        isSaving.value = false;
        return;
      }
      
      const payload = preparePayload();
      await createMateriaArea(payload);
      
      await fetchAreas();
      await Promise.all([fetchGroups(), fetchMateriasAreas()]);
      
      info({
        message: `${formData.value.type === 'area' ? 'Área' : 'Materia'} creada correctamente`,
        position: 'top'
      });
      
      closeDialog();
    } catch (err) {
      const errorMsg = extractErrorMessage(err, `No se pudo crear la ${formData.value.type === 'area' ? 'área' : 'materia'}`);
      error({ message: errorMsg, position: 'top' });
    } finally {
      isSaving.value = false;
    }
  }
  
  // Actualizar materia/área
  const updateMateria = async () => {
    try {
      isSaving.value = true;
      
      if (!validateForm()) {
        isSaving.value = false;
        return;
      }
      
      const payload = preparePayload();
      await updateMateriaArea(editingItem.value._id, payload);
      
      await fetchAreas();
      await Promise.all([fetchGroups(), fetchMateriasAreas()]);
      
      info({
        message: `${formData.value.type === 'area' ? 'Área' : 'Materia'} actualizada correctamente`,
        position: 'top'
      });
      
      closeDialog();
    } catch (err) {
      const errorMsg = extractErrorMessage(err, `No se pudo actualizar la ${formData.value.type === 'area' ? 'área' : 'materia'}`);
      error({ message: errorMsg, position: 'top' });
    } finally {
      isSaving.value = false;
    }
  }
  
  // Cambiar estado activo/inactivo
  const toggleStatus = async (item) => {
    try {
      isToggling.value = true;
      togglingItemId.value = item._id;
      
      const currentStatus = item.active !== undefined ? item.active : (item.isActive !== undefined ? item.isActive : true);
      
      if (currentStatus) {
        await desactivateMateriaArea(item._id);
        info({
          message: `${item.type === 'area' ? 'Área' : 'Materia'} desactivada correctamente`,
          position: 'top'
        });
      } else {
        await activateMateriaArea(item._id);
        info({
          message: `${item.type === 'area' ? 'Área' : 'Materia'} activada correctamente`,
          position: 'top'
        });
      }
      
      await Promise.all([fetchMateriasAreas(), fetchAreas()]);
    } catch (err) {
      error({
        message: err.response?.data?.msg || err.response?.data?.message || "No se pudo cambiar el estado",
        position: 'top'
      });
    } finally {
      isToggling.value = false;
      togglingItemId.value = null;
    }
  }
  
  // Abrir diálogo de confirmación de eliminación
  const handleDelete = (item) => {
    itemToDelete.value = item
    showDeleteDialog.value = true
  }
  
  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!itemToDelete.value) return;
    
    try {
      isDeleting.value = true;
      await deleteMateriaArea(itemToDelete.value._id);
      
      await fetchAreas();
      await fetchMateriasAreas();
      
      info({
        message: `${itemToDelete.value.type === 'area' ? 'Área' : 'Materia'} eliminada correctamente`,
        position: 'top'
      });
      showDeleteDialog.value = false;
      itemToDelete.value = null;
    } catch (err) {
      error({
        message: err.response?.data?.msg || "No se pudo eliminar",
        position: 'top'
      });
    } finally {
      isDeleting.value = false;
    }
  }
  
  // Filtrar por tipo
  const filteredRows = computed(() => {
    if (!filterType.value) return materiasAreasList.value;
    
    return materiasAreasList.value.filter(item => {
      const itemType = item.type?.toLowerCase() || '';
      const filterValue = filterType.value?.toLowerCase() || '';
      return itemType === filterValue;
    });
  })
  
  
  // Manejar cambio de tipo en el formulario
  const onTypeChange = (newType) => {
    formData.value.areaCode = '';
    if (newType === 'area') {
      formData.value.independent = false;
    }
  }
  
  // Abre el diálogo para crear
  const openCreateDialog = async () => {
    isEditMode.value = false;
    formData.value = {
      group: '',
      name: '',
      code: '',
      type: 'materia',
      areaCode: '',
      independent: false,
      includeInStatistics: true,
    };
    
    await Promise.all([fetchGroups(), fetchAreas()]);
    showDialog.value = true;
  }
  
  // Abre el diálogo para editar
  const handleEdit = async (item) => {
    isEditMode.value = true;
    editingItem.value = item;
    
    await Promise.all([fetchGroups(), fetchAreas()]);
    
    let groupId = '';
    if (item.group) {
      if (typeof item.group === 'object' && item.group !== null) {
        groupId = item.group._id || item.group.id || '';
      } else if (typeof item.group === 'string') {
        groupId = item.group;
      }
    }
    
    const areaCodeValue = item.type === 'materia' 
      ? (item.areaCode?.code || item.areaCode || '')
      : (item.code || '');
    
    formData.value = {
      group: groupId,
      name: item.name || '',
      code: item.code || '',
      type: item.type || 'materia',
      areaCode: areaCodeValue,
      independent: item.independent !== undefined ? item.independent : false,
      includeInStatistics: item.includeInStatistics !== undefined ? item.includeInStatistics : true,
    };
    
    showDialog.value = true;
  }
  
  // Cierra el diálogo
  const closeDialog = () => {
    showDialog.value = false;
    isEditMode.value = false;
    editingItem.value = null;
  }
  
  // Determina si se crea o actualiza
  const submitForm = async () => {
    if (isEditMode.value) {
      await updateMateria();
    } else {
      await createMateria();
    }
  }
  
  // Columnas base de la tabla
  const baseColumns = [
    { name: "name", label: "Nombre", field: "name", align: "left", sortable: true },
    { name: "code", label: "Código", field: "code", align: "center", sortable: true },
    { name: "type", label: "Tipo", field: "type", align: "center", sortable: true },
    { name: "areaCode", label: "Área", field: "areaCode", align: "center", sortable: true },
    { name: "group", label: "Grupo", field: "group", align: "left" },
    { name: "active", label: "Estado", field: "active", align: "center", sortable: true },
  ];
  
  // Columnas de la tabla con acciones si tiene permisos
  const columns = computed(() => {
    const cols = [...baseColumns];
    if (canEdit.value) {
      cols.push({ name: "actions", label: "Acciones", field: "actions", align: "center" });
    }
    return cols;
  });
  
  // Cargar datos al montar
  onMounted(async () => {
    await Promise.all([fetchGroups(), fetchAreas()]);
    await fetchMateriasAreas();
  });
  </script>
  
  <style scoped>
  .actionButtonContainer {
    margin-left: 800px;
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
  </style>
  
  