<template>
  <div class="q-pa-md">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-cube color="primary" size="5.5em" />
      <div class="q-ml-md text-h6">Cargando datos...</div>
    </div>

    <div v-else-if="error" class="text-center">
      <q-icon name="error" color="negative" size="4em" />
      <div class="text-h6 text-negative">Error al cargar el dashboard</div>
      <p>{{ error }}</p>
      <q-btn
        label="Reintentar"
        color="primary"
        @click="loadDashboard"
        icon="refresh"
      />
    </div>

    <div v-else>
      <q-card class="q-mb-md" flat bordered>
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h5">
              Bienvenido, {{ authStore.user?.name || '' }} {{ authStore.user?.lastName || '' }}
            </div>
            <div class="text-subtitle1 text-grey-7">
              {{ getRoleName(authStore.user?.rol) }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-subtitle2">Período Académico</div>
            <div class="text-h6">
              {{ dashboardData?.periodoActivo?.nombre || 'No definido' }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md q-mb-md">
        <!-- Tarjeta: Total de Estudiantes -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-blue-1 text-center">
            <q-card-section>
              <q-icon name="groups" size="3em" color="blue-8" />
              <div class="text-h4 q-mt-sm">{{ dashboardData?.totalEstudiantes || 0 }}</div>
              <div class="text-subtitle2 text-grey-8">Total Estudiantes</div>
            </q-card-section>
          </q-card>
        </div> 
        <!-- Tarjeta: Promedio General -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-green-1 text-center">
            <q-card-section>
              <q-icon name="functions" size="3em" color="green-8" />
              <div class="text-h4 q-mt-sm">{{ dashboardData?.promedioGeneral || '0.00' }}</div>
              <div class="text-subtitle2 text-grey-8">Promedio General</div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Tarjeta: Grupos Asignados -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-orange-1 text-center">
            <q-card-section>
              <q-icon name="school" size="3em" color="orange-8" />
              <div class="text-h4 q-mt-sm">{{ dashboardData?.gruposCount || 0 }}</div>
              <div class="text-subtitle2 text-grey-8">Grupos Asignados</div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Tarjeta: Período Actual -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card bg-purple-1 text-center">
            <q-card-section>
              <q-icon name="event" size="3em" color="purple-8" />
              <div class="text-h4 q-mt-sm">
                {{ dashboardData?.periodoActivo?.numero || 'N/A' }}
              </div>
              <div class="text-subtitle2 text-grey-8">Período Actual</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">Grupos y Materias Asignadas</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <div class="q-pa-md q-gutter-sm">
            <q-btn color="primary" label="Crear Grupo" @click="showCreateGroupDialog = true" />
          </div>
          <tables-component
            :rows="tableRows"
            :columns="tableColumns"
            row-key="_id"
            :loading="loading"
            :actions="true"
          >
            <!-- Slot para la columna 'subjects' (Materias) -->
            <template v-slot:body-cell-subjects="props">
              <q-td :props="props">
                <q-chip
                  v-for="(subject, index) in props.row.subjectsArray"
                  :key="index"
                  color="primary"
                  text-color="white"
                  size="sm"
                  class="q-mr-xs"
                >
                  {{ subject }}
                </q-chip>
              </q-td>
            </template>

            <!-- Slot para la columna 'studentCount' (Estudiantes) -->
            <template v-slot:body-cell-studentCount="props">
              <q-td :props="props" class="text-center">
                <q-badge color="blue-5" text-color="white" :label="props.value" />
              </q-td>
            </template>

            <!-- Slot para la columna 'averageGrade' (Promedio) -->
            <template v-slot:body-cell-averageGrade="props">
              <q-td :props="props" class="text-center">
                <q-badge :color="getGradeBadgeColor(props.value)" text-color="white">
                  {{ props.value }}
                </q-badge>
              </q-td>
            </template>

            <!-- Slot para la columna 'actions' (Acciones) -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn
                  icon="visibility"
                  color="info"
                  size="sm"
                  flat
                  dense
                  @click="viewGroupDetails(props.row)"
                >
                  <q-tooltip>Ver detalles</q-tooltip>
                </q-btn>
                <q-btn
                  icon="edit"
                  color="accent"
                  size="sm"
                  flat
                  dense
                  @click="editGroup(props.row)"
                >
                  <q-tooltip>Editar grupo</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  color="negative"
                  size="sm"
                  flat
                  dense
                  @click="confirmDeleteGroup(props.row)"
                >
                  <q-tooltip>Eliminar grupo</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <!-- Slot para cuando no hay datos -->
            <template v-slot:no-data>
              <div class="full-width row flex-center q-gutter-sm q-pa-md">
                <q-icon name="info" size="2em" color="warning" />
                <span class="text-subtitle1">
                  No hay grupos asignados para este año académico.
                </span>
              </div>
            </template>
          </tables-component>
        </q-card-section>
      </q-card>
    </div>

    <!-- Dialog para ver detalles del grupo -->
    <q-dialog v-model="showDetailsDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ selectedGroup?.name }}</div>
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-sm">
            <div><strong>Grado:</strong> {{ selectedGroup?.grade }}</div>
            <div><strong>Nivel:</strong> {{ selectedGroup?.level }}</div>
            <div><strong>Estudiantes:</strong> {{ selectedGroup?.studentCount }}</div>
            <div><strong>Promedio:</strong> {{ selectedGroup?.averageGrade }}</div>
            
            <q-separator class="q-my-md" />
            
            <div class="text-subtitle2 q-mb-sm">Materias:</div>
            <q-chip
              v-for="(subject, index) in selectedGroup?.subjectsArray"
              :key="index"
              color="primary"
              text-color="white"
              size="sm"
            >
              {{ subject }}
            </q-chip>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCreateGroupDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Crear Nuevo Grupo</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newGroup.groupIdentifier" label="Nombre del Grupo" />
          <q-input v-model="newGroup.grade" label="Grado" />
          <q-input v-model="newGroup.level" label="Nivel" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Crear" color="primary" @click="handleCreateGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditGroupDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Editar Grupo</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editableGroup.groupIdentifier" label="Nombre del Grupo" />
          <q-input v-model="editableGroup.grade" label="Grado" />
          <q-input v-model="editableGroup.level" label="Nivel" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="handleUpdateGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useAuthStore } from '../../store/authStore.js';
import axios from 'axios';
import TablesComponent from '../../components/tables.vue';
import { useNotify } from "../../composables/useNotify.js";

const authStore = useAuthStore();
const { showNotify, showErrorNotify } = useNotify();


const teacherName = ref(authStore.user ? authStore.user.name : "");

const loading = ref(false);
const error = ref(null);
// `showDetailsDialog`: controla si el diálogo de detalles del grupo está visible.
const showDetailsDialog = ref(false);
const showCreateGroupDialog = ref(false);
const showEditGroupDialog = ref(false);
// `selectedGroup`: guarda los datos del grupo que el usuario ha seleccionado para ver en detalle.
const selectedGroup = ref(null);
const newGroup = ref({ groupIdentifier: '', grade: '', level: '' });
const editableGroup = ref({ id: '', groupIdentifier: '', grade: '', level: '' });

// URL base de la API.
const API_URL =  'http://localhost:3000/api';


// `dashboardData`: obtiene los datos del dashboard desde el store de Pinia.
const dashboardData = computed(() => authStore.dashboardData);
// `gruposMaterias`: obtiene la lista de grupos y materias desde el store.
const gruposMaterias = computed(() => authStore.gruposMaterias);

// `tableColumns`: define la estructura de las columnas para la `q-table`.
const tableColumns = [
  {
    name: 'name',
    label: 'Grupo',
    field: 'name',
    align: 'left',
    sortable: true, // Permite ordenar por esta columna
    style: 'font-weight: 500;'
  },
  {
    name: 'grade',
    label: 'Grado',
    field: 'grade',
    align: 'center',
    sortable: true
  },
  {
    name: 'level',
    label: 'Nivel',
    field: 'level',
    align: 'center',
    sortable: true
  },
  {
    name: 'studentCount',
    label: 'Estudiantes',
    field: 'studentCount',
    align: 'center',
    sortable: true
  },

  {
    name: 'averageGrade',
    label: 'Promedio',
    field: 'averageGrade',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center'
  }
];

// `tableRows`: transforma los datos de `gruposMaterias` para que coincidan con lo que `q-table` espera.
// Es una buena práctica procesar los datos crudos antes de pasarlos a la tabla.
const tableRows = computed(() => {
  // Si no hay grupos, devuelve un array vacío.
  if (!gruposMaterias.value || gruposMaterias.value.length === 0) return [];

  // `map` crea un nuevo array transformando cada elemento del array original.
  return gruposMaterias.value.map(item => {
    let subjectsArray = [];

    // Extrae los nombres de las materias. La estructura de datos puede variar.
    if (Array.isArray(item.subjects)) {
      subjectsArray = item.subjects.map(s => {
        // Comprueba si la materia es un objeto con una propiedad `name`.
        if (typeof s === 'object' && s.subject) {
          return s.subject.name || s.subject;
        }
        return s.name || s;
      });
    }

    // Devuelve un objeto con el formato que necesita la fila de la tabla.
    return {
      _id: item._id, // ID único para el `row-key`
      name: item.name,
      grade: item.grade || 'N/A',
      level: item.level || 'N/A',
      studentCount: item.studentCount || 0,
      subjects: subjectsArray.join(', '), // Un string con las materias para mostrar
      subjectsArray: subjectsArray, // El array original para usar en los chips
      averageGrade: item.averageGrade || '0.00',
      rawData: item // Guardamos los datos originales por si se necesitan
    };
  });
});


/**Carga todos los datos necesarios para el dashboard.*/
const loadDashboard = async () => {
  // 1. Iniciar el estado de carga y limpiar errores previos.
  loading.value = true;
  error.value = null;
  console.log('🔄 Inciando la carga de datos del dashboard...');

  try {
    // Obtener el año actual para las consultas.
    const currentYear = new Date().getFullYear();

    // 2. Obtener el período académico activo para el año actual.
    console.log(`🔍 Buscando período activo para el año ${currentYear}...`);
    const activePeriod = await getActivePeriod(currentYear);
    if (activePeriod) {
      console.log('✅ Período activo encontrado:', activePeriod.nombre);
    } else {
      console.warn('⚠️ No se encontró un período activo para este año.');
    }

    // 3. Obtener todos los grupos del año actual.
    console.log(`📚 Obteniendo todos los grupos del año ${currentYear}...`);
    const allGroups = await getGroupsByYear(currentYear);
    console.log(`👍 ${allGroups.length} grupos encontrados en total.`);

    // 4. Filtrar los grupos que le corresponden al docente logueado.
    let teacherGroups = [];
    if (authStore.isTeacher) {
      console.log(`👨‍🏫 Filtrando grupos para el docente con ID: ${authStore.user.id}`);
      teacherGroups = allGroups.filter(
        // Un grupo le pertenece al docente si es el director de grupo.
        group => group.groupDirector?._id === authStore.user.id || 
                 group.groupDirector === authStore.user.id
      );
    } else {
      // Si no es un profesor (ej. un admin), puede ver todos los grupos.
      teacherGroups = allGroups;
    }
    console.log(`✅ ${teacherGroups.length} grupos asignados al usuario.`);

    // 5. Obtener detalles adicionales para cada grupo (estudiantes, notas).
    // `Promise.all` ejecuta todas las promesas en paralelo para mayor eficiencia.
    console.log('🔄 Obteniendo detalles (estudiantes y notas) para cada grupo...');
    const groupsWithDetails = await Promise.all(
      teacherGroups.map(async (group) => {
        try {
          // Llamadas a la API para obtener estudiantes y notas del grupo.
          const students = await getStudentsByGroup(group._id);
          const grades = await getGradesByGroup(group._id, currentYear);

          // Devolver un objeto con toda la información consolidada del grupo.
          return {
            _id: group._id,
            name: group.groupIdentifier || `${group.grade}-${group.level}`,
            grade: group.grade,
            level: group.level,
            subjects: group.subjects || [],
            studentCount: students?.length || 0,
            students: students || [],
            grades: grades || [],
            averageGrade: calculateAverageGrade(grades) // Calcular el promedio del grupo
          };
        } catch (err) {
          // Si falla la obtención de detalles para un grupo, se registra el error
          // y se devuelve un objeto con datos por defecto para no romper la UI.
          console.error(`❌ Error al obtener detalles del grupo ${group._id}:`, err);
          return {
            _id: group._id,
            name: group.groupIdentifier || `${group.grade}-${group.level}`,
            grade: group.grade,
            level: group.level,
            subjects: group.subjects || [],
            studentCount: 0,
            students: [],
            grades: [],
            averageGrade: '0.00'
          };
        }
      })
    );

    // 6. Calcular los totales para las tarjetas de estadísticas (KPIs).
    console.log('📊 Calculando estadísticas generales...');
    // Sumar el número de estudiantes de todos los grupos.
    const totalEstudiantes = groupsWithDetails.reduce(
      (sum, group) => sum + group.studentCount,
      0
    );

    // Calcular el promedio general de todos los grupos.
    const promedioGeneral = calculateGeneralAverage(groupsWithDetails);

    // 7. Guardar los datos procesados en el store de Pinia.
    // Esto hace que los datos estén disponibles en otros componentes si es necesario.
    authStore.dashboardData = {
      totalEstudiantes,
      promedioGeneral: promedioGeneral.toFixed(2),
      periodoActivo: activePeriod || { nombre: 'N/A' },
      gruposCount: groupsWithDetails.length
    };

    authStore.gruposMaterias = groupsWithDetails;

    console.log('🎉 ¡Dashboard cargado exitosamente!');

    // 8. Mostrar una notificación de éxito al usuario.
    showNotify('Actualizado correctamente.');

  } catch (err) {
    // Si ocurre cualquier error durante el proceso, se captura aquí.
    error.value = err.message || 'Ocurrió un error inesperado.';
    console.error('❌ Error al cargar:', err);

    // Notificar al usuario sobre el error.
    showErrorNotify('No se pudieron cargar los datos del dashboard.', err.message);
  } finally {
    // 9. Finalizar el estado de carga, sin importar si hubo éxito o error.
    loading.value = false;
    console.log('🏁 Proceso de carga finalizado.');
  }
};


/**
 * Obtiene el período académico activo para un año específico.
 * @param {number} year - El año a consultar.
 */
const getActivePeriod = async (year) => {
  const url = `${API_URL}/periodos/year/${year}`;
  console.log(`📞 API Call: GET ${url}`);
  try {
    const response = await axios.get(url);
    const periods = response.data;
    // Busca el período que tiene la propiedad `active` en `true`.
    const activePeriod = periods.find(p => p.active === true);
    return activePeriod ? {
      _id: activePeriod._id,
      nombre: activePeriod.name,
      numero: activePeriod.number,
      porcentaje: activePeriod.percentage
    } : null;
  } catch (error) {
    console.error('❌ Error en getActivePeriod:', error.message);
    return null; // Devuelve null si hay un error para no detener la carga.
  }
};

/**
 * Obtiene todos los grupos para un año específico.
 * @param {number} year - El año a consultar.
 */
const getGroupsByYear = async (year) => {
  const url = `${API_URL}/grupos/year/${year}`;
  console.log(`📞 API Call: GET ${url}`);
  try {
    const response = await axios.get(url);
    return response.data || []; // Devuelve un array vacío si no hay datos.
  } catch (error) {
    console.error('❌ Error en getGroupsByYear:', error.message);
    return []; // Devuelve un array vacío en caso de error.
  }
};

/**
 * Obtiene la lista de estudiantes de un grupo específico.
 * @param {string} groupId - El ID del grupo.
 */
const getStudentsByGroup = async (groupId) => {
  const url = `${API_URL}/grupos/${groupId}/estudiantes`;
  console.log(`📞 API Call: GET ${url}`);
  try {
    const response = await axios.get(url);
    return response.data || [];
  } catch (error) {
    // Si el backend devuelve un 404, ahora debería devolver un array vacío.
    console.error(`❌ Error en getStudentsByGroup para grupo ${groupId}:`, error.message);
    return [];
  }
};

/**
 * Obtiene las calificaciones de un grupo para un año específico.
 * @param {string} groupId - El ID del grupo.
 * @param {number} year - El año de las calificaciones.
 */
const getGradesByGroup = async (groupId, year) => {
  const url = `${API_URL}/calificaciones/grupos/${groupId}/calificaciones`;
  console.log(`📞 API Call: GET ${url}`);
  try {
    const response = await axios.get(url);
    return response.data || [];
  } catch (error) {
    console.error(`❌ Error en getGradesByGroup para grupo ${groupId}:`, error.message);
    return [];
  }
};

const createGroup = async (groupData) => {
  const url = `${API_URL}/grupos`;
  console.log(`📞 API Call: POST ${url}`);
  try {
    const response = await axios.post(url, groupData);
    showNotify("Grupo creado exitosamente");
    return response.data;
  } catch (error) {
    console.error('❌ Error en createGroup:', error.message);
    showErrorNotify("Error al crear el grupo");
    return null;
  }
};

const updateGroup = async (groupId, groupData) => {
  const url = `${API_URL}/grupos/${groupId}`;
  console.log(`📞 API Call: PUT ${url}`);
  try {
    const response = await axios.put(url, groupData);
    showNotify("Grupo actualizado exitosamente");
    return response.data;
  } catch (error) {
    console.error('❌ Error en updateGroup:', error.message);
    showErrorNotify("Error al actualizar el grupo");
    return null;
  }
};

const deleteGroup = async (groupId) => {
  const url = `${API_URL}/grupos/${groupId}`;
  console.log(`📞 API Call: DELETE ${url}`);
  try {
    await axios.delete(url);
showNotify("Grupo eliminado exitosamente");
  } catch (error) {
    console.error('❌ Error en deleteGroup:', error.message);
    showErrorNotify("Error al eliminar el grupo");
  }
};

/**
 * Calcula el promedio de calificaciones para un solo grupo.
 * @param {Array} grades - Un array de objetos de calificación.
 */
const calculateAverageGrade = (grades) => {
  if (!grades || grades.length === 0) return '0.00';

  // `reduce` suma todas las calificaciones.
  const sum = grades.reduce((acc, grade) => acc + (grade.grade || 0), 0);
  const average = sum / grades.length;

  // `toFixed(2)` formatea el número a 2 decimales.
  return average.toFixed(2);
};

/**
 * Calcula el promedio general de todos los grupos.
 * @param {Array} groups - Un array de objetos de grupo.
 */
const calculateGeneralAverage = (groups) => {
  if (!groups || groups.length === 0) return 0;

  // Filtra solo los grupos que tienen un promedio válido.
  const validGroups = groups.filter(g => g.averageGrade && parseFloat(g.averageGrade) > 0);
  if (validGroups.length === 0) return 0;

  const sum = validGroups.reduce((acc, group) => acc + parseFloat(group.averageGrade), 0);
  return sum / validGroups.length;
};


/**
 * Devuelve el nombre legible de un rol.
 * @param {string} role - El rol en minúsculas (ej. 'profesor').
 */
const getRoleName = (role) => {
  const roles = {
    'profesor': 'Profesor',
    'secretaria': 'Secretaria',
    'rector': 'Rector',
    'coordinador': 'Coordinador',
    'acudiente': 'Acudiente',
    'estudiante': 'Estudiante'
  };
  return roles[role] || role; // Devuelve el rol original si no se encuentra.
};

/**
 * Devuelve un color para el texto de la nota según su valor.
 * @param {string|number} grade - La calificación.
 */
const getGradeBadgeColor = (grade) => {
  const numGrade = parseFloat(grade);
  if (numGrade >= 4.5) return 'positive'; // Verde
  if (numGrade >= 3.5) return 'info';     // Azul
  if (numGrade >= 3.0) return 'warning';  // Naranja
  return 'negative';                     // Rojo
};

/**
 * Muestra el diálogo con los detalles de un grupo.
 * @param {object} group - El objeto del grupo seleccionado de la tabla.
 */
const viewGroupDetails = (group) => {
  selectedGroup.value = group; // Guarda el grupo seleccionado.
  showDetailsDialog.value = true; // Abre el diálogo.
};

/**
 * Simula la acción de editar un grupo.
 * @param {object} group - El objeto del grupo a editar.
 */
const editGroup = (group) => {
  editableGroup.value = { ...group };
  showEditGroupDialog.value = true;
};

const handleCreateGroup = async () => {
  await createGroup(newGroup.value);
  showCreateGroupDialog.value = false;
  loadDashboard();
};

const handleUpdateGroup = async () => {
  await updateGroup(editableGroup.value._id, editableGroup.value);
  showEditGroupDialog.value = false;
  loadDashboard();
};

const confirmDeleteGroup = (group) => {
  if (window.confirm(`¿Está seguro de que desea eliminar el grupo ${group.name}?`)) {
    deleteGroup(group._id).then(() => {
      loadDashboard();
    });
  }
};

/**
 * `onMounted` se ejecuta una sola vez, después de que el componente
 * ha sido añadido al DOM. Es el lugar ideal para cargar datos iniciales.
 */
onMounted(async () => {
  console.log('🚀 Componente Dashboard montado. Iniciando carga de datos...');
  // Llama a la función principal para cargar todo el dashboard.
  await loadDashboard();
});

</script>

<style scoped>
.stat-card {
  min-height: 130px;
  transition: transform 0.2s, box-shadow 0.2s; 
}

.stat-card:hover {
  transform: translateY(-5px); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); 
}

.q-table {
  box-shadow: none;
}
</style>