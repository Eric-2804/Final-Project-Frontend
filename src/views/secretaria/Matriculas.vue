<template>
  <q-layout view="lHh LpR fFf">
    <q-header bordered class="bgPrimary textWhite">
      <HeaderComponent />
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row q-col-gutter-md">
          <section class="col-12">
            <q-card class="shadow1">
              <q-card-section>
                <div v-if="isLoading" class="text-center q-pa-xl">
                  <q-spinner size="50px" color="primary" />
                  <div class="loadingMessage">Cargando matrículas...</div>
                </div>
                <div class="row items-center q-mb-lg">
                  <q-card-section class="pageHeaderInfo">
                    <div class="pageTitle">
                      Gestión de Matrículas
                    </div>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      Crear y gestionar las matrículas de la institución
                    </div>
                  </q-card-section>
                  <q-space />
                  <div class="actionButtonContainer">
                    <q-btn color="primary" icon="add" label="AGREGAR MATRÍCULA" @click="openCreateDialog" />
                  </div>
                </div>
                <Table v-if="!isLoading" :rows="filteredRows" :columns="columns" :actions="true"
                  @edit="handleEditRegistration" @toggleState="toggleStatus" />
                <q-dialog v-model="showDialog" persistent>
                  <q-card style="min-width: 520px; max-width: 90vw;">
                    <q-card-section class="row items-center q-pb-none dialogHeader">
                      <div class="text-h6">{{ isEditMode ? 'Editar Matrícula' : 'Crear Matrícula' }}</div>
                      <q-space />
                      <q-btn icon="close" flat round dense @click="closeDialog" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                      <q-form @submit.prevent="submitForm">
                        <div class="row q-col-gutter-md">
                          <div class="col-12">
                            <q-select
                              v-model="formData.student"
                              :options="studentOptions"
                              label="Estudiante"
                              outlined
                              emit-value
                              map-options
                              :rules="[val => !!val || 'El estudiante es requerido']"
                            />
                          </div>
                          <div class="col-12">
                            <q-select
                              v-model="formData.group"
                              :options="groupOptions"
                              label="Grupo"
                              outlined
                              emit-value
                              map-options
                              :rules="[val => !!val || 'El grupo es requerido']"
                            />
                          </div>
                        </div>
                        <div class="row q-mt-md justify-end">
                          <q-btn flat label="Cancelar" color="grey-7" class="q-mr-sm" @click="closeDialog" />
                          <q-btn type="submit" color="primary" :label="isEditMode ? 'Guardar cambios' : 'Crear matrícula'" />
                        </div>
                      </q-form>
                    </q-card-section>
                  </q-card>
                </q-dialog>
              </q-card-section>
            </q-card>
          </section>
        </div>
        <FooterComponent />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import api from '../../services/api.js';
import Table from "../../components/tables.vue"
import { useNotify } from "../../composables/useNotify.js"
const { showNotify: info, showErrorNotify: error } = useNotify()
import HeaderComponent from '../../components/Header.vue'
import FooterComponent from '../../components/Footer.vue'

const isLoading = ref(false)
const registrationList = ref([])
const searchText = ref("")
const showDialog = ref(false)
const isEditMode = ref(false)
const editingItem = ref(null)

const formData = ref({
  student: "",
  group: "",
})

const studentOptions = ref([])
const groupOptions = ref([])

const fetchStudents = async () => {
  try {
    const response = await api.get('/users/role/estudiante');
    const items = response.data.users;
    studentOptions.value = items.map(s => ({ label: `${s.name} ${s.lastName}`, value: s._id }))
  } catch (err) {
    console.error('Error al cargar estudiantes:', err)
    error('No se pudieron cargar los estudiantes')
  }
}

const fetchGroups = async () => {
  try {
    const response = await api.get('/grupos');
    const items = response.data.groups;
    groupOptions.value = items.map(g => ({ label: g.name, value: g._id }))
  } catch (err) {
    console.error('Error al cargar grupos:', err)
    error('No se pudieron cargar los grupos')
  }
}

const fetchRegistrations = async () => {
  try {
    isLoading.value = true
    const response = await api.get("/registration");
    registrationList.value = response.data.registrations;
  } catch (err) {
    console.error("Error al cargar matrículas:", err)
    error("No se pudieron cargar las matrículas")
  } finally {
    isLoading.value = false
  }
}

const createRegistration = async () => {
  try {
    await api.post("/registration", formData.value)
    await fetchRegistrations()
    info("Matrícula registrada correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al registrar matrícula:", err.response?.data || err.message)
    error(err.response?.data?.msg || "No se pudo registrar la matrícula")
  }
}

const updateRegistration = async () => {
  try {
    await api.put(`/registration/${editingItem.value._id}`, formData.value)
    await fetchRegistrations()
    info("Matrícula actualizada correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al actualizar matrícula:", err)
    error("No se pudo actualizar la matrícula")
  }
}

const toggleStatus = async (registrationItem) => {
  try {
    const endpoint = registrationItem.isActive ? `/registration/${registrationItem._id}/inactivar` : `/registration/${registrationItem._id}/activar`
    await api.put(endpoint, {})
    info(`Matrícula ${registrationItem.isActive ? 'inactivada' : 'activada'} correctamente`)
    await fetchRegistrations()
  } catch (err) {
    console.error("Error al cambiar estado de matrícula:", err)
    error("No se pudo cambiar el estado de la matrícula")
  }
}

const filteredRows = computed(() => {
  const term = searchText.value?.toLowerCase().trim()
  if (!term) return registrationList.value
  const fields = ["student.name", "group.name"]

  return registrationList.value.filter(r =>
    fields.some(field => {
      const value = field.split('.').reduce((o, i) => o[i], r)?.toString().toLowerCase()
      return value?.includes(term)
    })
  )
})

const openCreateDialog = () => {
  isEditMode.value = false
  formData.value = { student: '', group: '' }
  showDialog.value = true
}

const handleEditRegistration = (r) => {
  isEditMode.value = true
  editingItem.value = r
  formData.value = {
    student: r?.student?._id || r?.student || '',
    group: r?.group?._id || r?.group || '',
  }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  isEditMode.value = false
  editingItem.value = null
}

const submitForm = () =>
  isEditMode.value ? updateRegistration() : createRegistration()

const columns = [
  { name: "student", label: "Estudiante", field: row => `${row.student.name} ${row.student.lastName}`, align: "left" },
  { name: "group", label: "Grupo", field: row => row.group.name, align: "left" },
  { name: "isActive", label: "Estado", field: "isActive", align: "center", format: val => val ? "Activa" : "Inactiva" },
  { name: "actions", label: "Acciones", field: "actions", align: "center" },
]

onMounted(() => {
  fetchRegistrations()
  fetchStudents()
  fetchGroups()
})
</script>

<style scoped>
.actionButtonContainer {
  margin-left: 800px;
}
</style>