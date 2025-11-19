<template>
  <q-page class="q-pa-md">

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6">Gestión de Matrículas (Secretaría)</div>
        <div class="text-caption text-grey-7">Año: {{ currentYear }}</div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn color="primary" icon="refresh" label="Recargar" @click="loadAll" />
        <q-btn color="primary" icon="add" label="Crear matrícula" @click="openCreate" />
      </div>
    </div>

    <!-- SPINNER -->
    <div v-if="loading" class="q-pa-xl q-mb-md">
      <Spinner />
    </div>

    <!-- TABLA (nota: backend devuelve 1 matrícula por año => mostramos 0 o 1 fila) -->
    <div v-else>
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        class="shadow-1"
        dense
      >
        <template v-slot:body-cell-studentName="props">
          <q-td :props="props">
            {{ props.row.studentName || 'Desconocido' }}
          </q-td>
        </template>

        <template v-slot:body-cell-group="props">
          <q-td :props="props">
            {{ props.row.groupLabel || props.row.group || 'N/A' }}
          </q-td>
        </template>

        <template v-slot:body-cell-registrationDate="props">
          <q-td :props="props">
            {{ props.row.registrationDate || '-' }}
          </q-td>
        </template>

        <template v-slot:body-cell-state="props">
          <q-td :props="props" class="text-center">
            <q-chip dense outline :color="props.row.state === 'ACTIVO' ? 'positive' : 'grey'">
              {{ props.row.state }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn dense round size="sm" icon="visibility" title="Ver detalles" @click="openView(props.row)" class="q-mr-sm" />
            <q-btn dense round size="sm" icon="edit" title="Editar" color="primary" @click="openEdit(props.row)" class="q-mr-sm" />
            <!-- Estado: abrimos menú para elegir acción -->
            <q-menu auto-close cover>
              <template v-slot:anchor>
                <q-btn dense round size="sm" icon="more_vert" title="Acciones de estado" />
              </template>
              <q-list style="min-width: 180px">
                <q-item clickable v-if="props.row.state !== 'ACTIVO'" @click="changeState(props.row, 'activate')">
                  <q-item-section>Activar</q-item-section>
                </q-item>
                <q-item clickable v-if="props.row.state !== 'RETIRADO'" @click="changeState(props.row, 'desactivate')">
                  <q-item-section>Retirar / Desactivar</q-item-section>
                </q-item>
                <q-item clickable v-if="props.row.state !== 'DESERTADO'" @click="changeState(props.row, 'desertion')">
                  <q-item-section>Marcar deserción</q-item-section>
                </q-item>
                <q-item clickable v-if="props.row.state !== 'GRADUADO'" @click="changeState(props.row, 'graduated')">
                  <q-item-section>Marcar graduado</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="text-center q-pa-md">
            No hay matrícula para el año {{ currentYear }}.
            <div class="q-mt-md">
              <q-btn color="primary" label="Crear matrícula" @click="openCreate" />
            </div>
          </div>
        </template>
      </q-table>
    </div>

    <!-- DIALOG: VER DETALLES -->
    <q-dialog v-model="viewDialog">
      <q-card style="min-width: 600px; max-width: 900px">
        <q-card-section class="row items-center justify-between modal-header">
          <div class="text-h6">Detalles de Matrícula</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="selected">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div><strong>Código:</strong> {{ selected.registrationNumber }}</div>
                <div><strong>Estudiante:</strong> {{ selected.studentName }}</div>
                <div><strong>Grupo:</strong> {{ selected.groupLabel || selected.group }}</div>
                <div><strong>Estado:</strong> {{ selected.state }}</div>
              </div>
              <div class="col-12 col-md-6">
                <div><strong>Fecha matrícula:</strong> {{ selected.registrationDate }}</div>
                <div><strong>Descripción:</strong> {{ selected.description || '-' }}</div>
                <div><strong>Última actualización:</strong> {{ selected.lastChange || '-' }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            <div>No hay datos para mostrar.</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG: FORM CREAR / EDITAR -->
    <q-dialog v-model="formDialog">
      <q-card style="min-width: 600px; max-width: 900px">
        <q-card-section class="row items-center justify-between modal-header">
          <div class="text-h6">{{ isEditing ? 'Editar Matrícula' : 'Nueva Matrícula' }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="submitForm" class="q-gutter-md">

            <!-- Grupo: cargar por año -->
            <q-select
              filled
              label="Grupo"
              :options="groupOptions"
              option-value="_id"
              option-label="label"
              v-model="form.group"
              emit-value
              map-options
              dense
              @update:model-value="onGroupChange"
              :rules="[val => !!val || 'Seleccione un grupo']"
            />

            <!-- Estudiante: cargado según grupo -->
            <q-select
              filled
              label="Estudiante"
              :options="studentOptions"
              option-value="_id"
              option-label="label"
              v-model="form.student"
              emit-value
              map-options
              dense
              :rules="[val => !!val || 'Seleccione un estudiante']"
            />

            <!-- Número de matrícula -->
            <q-input v-model="form.registrationNumber" filled label="Número de matrícula" dense :rules="[v => !!v || 'Requerido']" />

            <!-- Fecha de matrícula -->
            <q-input v-model="form.registrationDate" type="date" filled label="Fecha de matrícula" dense :rules="[v => !!v || 'Requerido']" />

            <!-- Descripción -->
            <q-input v-model="form.description" filled label="Descripción (opcional)" dense />

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancelar" color="grey" v-close-popup />
              <q-btn color="primary" label="Guardar" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import api from '@/services/api.js'
import Spinner from '@/components/Spinner.vue'
import { useNotify } from '@/composables/useNotify'

const $q = useQuasar()
const { showNotify, showErrorNotify } = useNotify()

/* ============================
   STATE
============================ */
const loading = ref(false)
const currentYear = new Date().getFullYear()
const rows = ref([])
const selected = ref(null)

const viewDialog = ref(false)
const formDialog = ref(false)
const isEditing = ref(false)

/* FORM MODEL */
const form = reactive({
  _id: null,
  student: '',
  group: '',
  registrationNumber: '',
  registrationDate: new Date().toISOString().split('T')[0],
  description: '',
  year: currentYear
})

/* HELPERS */
const groups = ref([])
const students = ref([])

/* UI Select options */
const groupOptions = computed(() =>
  groups.value.map(g => ({
    ...g,
    label: `${g.grade || ''}${g.groupIdentifier ? g.groupIdentifier : ''} - ${g.session || ''}`
  }))
)

const studentOptions = computed(() =>
  students.value.map(s => ({
    ...s,
    label: `${s.names} ${s.lastNames} — ${s.numberDocument || ''}`
  }))
)

/* TABLE COLUMNS */
const columns = [
  { name: 'registrationNumber', label: 'Código', field: 'registrationNumber', align: 'left' },
  { name: 'studentName', label: 'Estudiante', field: 'studentName', align: 'left' },
  { name: 'group', label: 'Grupo', field: 'group', align: 'left' },
  { name: 'state', label: 'Estado', field: 'state', align: 'center' },
  { name: 'registrationDate', label: 'Fecha', field: 'registrationDate', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
]

/* ============================
   UNIVERSAL ERROR HANDLER
============================ */
function handleApiError(err, defaultMsg = 'Error en la operación') {
  const msg =
    err?.response?.data?.msg ||
    err?.response?.data?.error ||
    err?.message ||
    defaultMsg

  showErrorNotify(msg)
}

/* ============================
   ON MOUNT
============================ */
onMounted(() => {
  loadAll()
})

/* ============================
   LOAD ALL REGISTRATIONS + GROUPS
============================ */
async function loadAll() {
  loading.value = true
  try {
    const regRes = await api.get(`/api/registration/year/${currentYear}`)
    const list = Array.isArray(regRes.data?.data) ? regRes.data.data : []

    const gRes = await api.get(`/api/grupos/year/${currentYear}`)
    groups.value = Array.isArray(gRes.data?.data) ? gRes.data.data : []

    rows.value = list.map(reg => ({
      id: reg._id,
      _raw: reg,
      registrationNumber: reg.registrationNumber,
      registrationDate: reg.registrationDate
        ? new Date(reg.registrationDate).toLocaleDateString()
        : '-',
      studentName: reg.student
        ? `${reg.student.names} ${reg.student.lastNames}`
        : 'Sin estudiante',
      groupLabel: reg.group
        ? `${reg.group.grade || ''} ${reg.group.level || ''}`.trim()
        : 'Sin grupo',
      state: reg.state,
      description: reg.description || '',
      schoolName: reg.school?.name || 'Sin colegio',
      lastChange: reg.updatedAt ? new Date(reg.updatedAt).toLocaleString() : '-'
    }))

    showNotify('Datos cargados correctamente')
  } catch (err) {
    handleApiError(err, 'Error cargando matrículas')
  } finally {
    loading.value = false
  }
}

/* ============================
   LOAD STUDENTS BY GROUP
============================ */
async function loadStudentsByGroup(groupId) {
  students.value = []
  if (!groupId) return
  try {
    const res = await api.get(`/api/grupos/${groupId}/estudiantes`)
    students.value = Array.isArray(res.data?.data)
      ? res.data.data
      : (res.data?.data ? [res.data.data] : [])
  } catch (err) {
    handleApiError(err, 'No se pudieron cargar los estudiantes del grupo')
  }
}

/* ============================
   ACTIONS: VIEW / CREATE / EDIT
============================ */
function openView(row) {
  selected.value = row
  viewDialog.value = true
}

function openCreate() {
  isEditing.value = false
  resetForm()
  formDialog.value = true
}

async function openEdit(row) {
  isEditing.value = true
  resetForm()
  try {
    const res = await api.get(`/api/registration/${row.id}`)
    const reg = res.data?.data
    if (!reg) {
      showErrorNotify('Registro no encontrado')
      return
    }

    form._id = reg._id
    form.group = reg.group
    form.student = reg.student
    form.registrationNumber = reg.registrationNumber
    form.registrationDate = reg.registrationDate
      ? reg.registrationDate.split('T')[0]
      : new Date().toISOString().split('T')[0]
    form.description = reg.description || ''
    form.year = reg.year || currentYear

    await loadStudentsByGroup(form.group)
    formDialog.value = true
  } catch (err) {
    handleApiError(err, 'No se pudo cargar la matrícula')
  }
}

function resetForm() {
  form._id = null
  form.student = ''
  form.group = ''
  form.registrationNumber = ''
  form.registrationDate = new Date().toISOString().split('T')[0]
  form.description = ''
  form.year = currentYear
  students.value = []
}

/* GROUP SELECT ON CHANGE */
function onGroupChange(val) {
  loadStudentsByGroup(val)
}

/* ============================
   SUBMIT FORM (CREATE / UPDATE)
============================ */
async function submitForm() {
  try {
    if (!form.group || !form.student || !form.registrationNumber || !form.registrationDate) {
      showErrorNotify('Complete los campos obligatorios')
      return
    }

    if (isEditing.value && form._id) {
      await api.put(`/api/registration/${form._id}`, {
        student: form.student,
        attendant: [],
        group: form.group,
        year: form.year,
        registrationDate: form.registrationDate,
        registrationNumber: form.registrationNumber,
        description: form.description
      })
      showNotify('Matrícula actualizada')
    } else {
      await api.post('/api/registration', {
        student: form.student,
        attendant: [],
        group: form.group,
        year: form.year,
        registrationDate: form.registrationDate,
        registrationNumber: form.registrationNumber,
        description: form.description
      })
      showNotify('Matrícula creada')
    }

    formDialog.value = false
    await loadAll()

  } catch (err) {
    handleApiError(err)
  }
}

/* ============================
   CHANGE STATE
============================ */
async function changeState(row, action) {
  if (!row?.id) return

  const confirm = await $q.dialog({
    title: 'Confirmar',
    message: `¿Seguro que deseas ejecutar "${action}" sobre la matrícula ${row.registrationNumber}?`,
    cancel: true,
    persistent: true
  }).onOk(() => true).onCancel(() => false)

  if (!confirm) return

  try {
    loading.value = true

    const endpoint = {
      activate: `/api/registration/${row.id}/activate`,
      desactivate: `/api/registration/${row.id}/desactivate`,
      desertion: `/api/registration/${row.id}/desertion`,
      graduated: `/api/registration/${row.id}/graduated`
    }[action]

    if (!endpoint) throw new Error('Acción inválida')

    await api.put(endpoint)
    showNotify(`Estado actualizado: ${action}`)
    await loadAll()

  } catch (err) {
    handleApiError(err, 'No se pudo cambiar el estado')
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.modal-header {
  background: #71277A;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.text-h6 {
  font-weight: 600;
}
</style>