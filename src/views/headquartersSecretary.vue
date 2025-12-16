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
                  <div class="loadingMessage">Cargando sedes...</div>
                </div>

                <div class="row items-center q-mb-lg">
                  <q-card-section class="pageHeaderInfo">
                    <div class="pageTitle">
                      Gestión de Sedes
                    </div>
                    <div class="text-caption text-grey-7 q-mt-xs">
                      Crear y gestionar las sedes de la institución
                    </div>
                  </q-card-section>

                  <q-space />
                  <div class="actionButtonContainer">
                    <q-btn color="primary" icon="add" label="AGREGAR SEDE" @click="openCreateDialog" />
                  </div>
                </div>

                 <Table
          :rows="headquartersList"
          :columns="columns"
          :filter="filter"
          new-item-label="Nueva Sede"
          @new="openCreateDialog"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                dense
                flat
                round
                icon="edit"
                @click="handleEditHeadquarters(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn dense flat round @click="toggleStatus(props.row)">
                <q-avatar
                  :color="props.row.isActive ? 'green-5' : 'red-5'"
                  text-color="white"
                  :icon="props.row.isActive ? 'check' : 'close'"
                  size="28px"
                />
                <q-tooltip>
                  {{ props.row.isActive ? 'Desactivar' : 'Activar' }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </Table>

                <q-dialog v-model="showDialog" persistent>
                  <q-card style="min-width: 520px; max-width: 90vw;">
                    <q-card-section class="row items-center q-pb-none dialogHeader">
                      <div class="text-h6">{{ isEditMode ? 'Editar Sede' : 'Crear Sede' }}</div>
                      <q-space />
                      <q-btn icon="close" flat round dense @click="closeDialog" />
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                      <q-form @submit.prevent="submitForm">

                        <div class="row q-col-gutter-md">
                          <div class="col-12" v-if="!isEditMode">
                            <q-select
                              v-model="formData.school"
                              :options="schoolOptions"
                              label="Colegio"
                              outlined
                              emit-value
                              map-options
                              :rules="[val => !!val || 'El colegio es requerido']"
                            />
                          </div>

                          <div class="col-12 col-md-6">
                            <q-input v-model="formData.name" label="Nombre" outlined
                              :rules="[val => !!val || 'Nombre requerido']" />
                          </div>
                          <div class="col-12 col-md-6">
                            <q-input v-model="formData.abbreviation" label="Abreviatura" outlined
                              :rules="[val => !!val || 'Abreviatura requerida']" />
                          </div>

                          <div class="col-12 col-md-6">
                            <q-input v-model="formData.code" label="Código" outlined
                              :rules="[val => !!val || 'Código requerido']" />
                          </div>

                          <div class="col-12 col-md-6">
                            <q-input v-model="formData.phone" label="Teléfono" outlined
                              :rules="[val => !!val || 'Teléfono requerido']" />
                          </div>

                          <div class="col-12">
                            <q-input v-model="formData.address" label="Dirección" outlined autogrow
                              :rules="[val => !!val || 'Dirección requerida']" />
                          </div>
                        </div>

                        <div class="row q-mt-md">
                          <div class="col-12">
                            <q-toggle v-model="formData.isActive" label="Sede activa" />
                          </div>
                        </div>

                        <div class="row q-mt-md justify-end">
                          <q-btn flat label="Cancelar" color="grey-7" class="q-mr-sm" @click="closeDialog" />
                          <q-btn type="submit" color="primary" :label="isEditMode ? 'Guardar cambios' : 'Crear sede'" />
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
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from '../services/api.js'; 
import { useAuthStore } from '../stores/auth';
import { getAllSedes, createSede, updateSede, activateSede, deactivateSede } from '../services/headquarterService'; 
import { getAllColegios } from '../services/colegiosService';
import Table from "../components/tables.vue"
import { useNotify } from "../composables/useNotify.js"
const { showNotify: info, showErrorNotify: error } = useNotify()
import HeaderComponent from '../components/Header.vue'

const isLoading = ref(false)
const headquartersList = ref([])
const showDialog = ref(false)
const isEditMode = ref(false)
const editingItem = ref(null)
const authStore = useAuthStore();

const formData = ref({
  school: null, 
  name: "",
  abbreviation: "",
  code: "",
  address: "",
  phone: "",
  isActive: true,
})

const schoolOptions = ref([])

const filter = ref(""); 

const fetchSchools = async () => {
  try {
    const response = await getAllColegios();
    const items = Array.isArray(response.data.schools) ? response.data.schools : [];
    schoolOptions.value = items.map(s => ({
      label: s.name,
      value: s._id
    }));
  } catch (err) {
    console.error('Error al cargar colegios:', err);
    error('No se pudieron cargar los colegios. Es posible que no tenga permisos.');
  }
}

const toggleStatus = async (headquartersItem) => {
  try {
    const newIsActiveState = !headquartersItem.isActive;

    if (newIsActiveState) {
      await activateSede(headquartersItem._id);
    } else {
      await deactivateSede(headquartersItem._id);
    }

    info(`Sede ${newIsActiveState ? 'activada' : 'desactivada'} correctamente`);
    const index = headquartersList.value.findIndex(h => h._id === headquartersItem._id);
    if (index !== -1) {
      headquartersList.value[index].isActive = newIsActiveState;
    }
  } catch (err) {
    console.error("Error al cambiar estado de sede:", err);
    const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.msg || "Error al cambiar estado de sede";
    error(errorMsg);
  }
};

const fetchHeadquarters = async () => {
  try {
    isLoading.value = true
    const res = await getAllSedes(); 

    headquartersList.value = Array.isArray(res?.headquarters) ? res.headquarters : []

  } catch (err) {
    console.error("Error al cargar sedes:", err)
    error("No se pudieron cargar las sedes")
  } finally {
    isLoading.value = false
  }
}

const createHeadquarters = async () => {
  try {
    await createSede(formData.value) 
    await fetchHeadquarters()
    info("Sede registrada correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al registrar sede:", err.response?.data || err.message)
    error(err.response?.data?.msg || "No se pudo registrar la sede")
  }
}

const updateHeadquarters = async () => {
  try {
    const dataToUpdate = {
      school: formData.value.school,
      name: formData.value.name,
      abbreviation: formData.value.abbreviation,
      code: formData.value.code,
      address: formData.value.address,
      phone: formData.value.phone,
      isActive: formData.value.isActive, 
    };
    await updateSede(editingItem.value._id, dataToUpdate);
    await fetchHeadquarters();
    info("Sede actualizada correctamente");
    closeDialog();
  } catch (err) {
    console.error("Error al actualizar sede:", err);
    error(err.response?.data?.msg || "No se pudo actualizar la sede");
  }
};

const openCreateDialog = () => {
  isEditMode.value = false
  fetchSchools()
  formData.value = { school: null, name: '', abbreviation: '', code: '', address: '', phone: '', isActive: true }
  showDialog.value = true
}

const handleEditHeadquarters = (h) => {
  isEditMode.value = true
  editingItem.value = h
  
  formData.value = {
    school: h?.school?._id || h.school, 
    name: h?.name || '',
    abbreviation: h?.abbreviation || '',
    code: h?.code || '',
    address: h?.address || '',
    phone: h?.phone || '',
    isActive: typeof h?.isActive === 'boolean' ? h.isActive : true,
  }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  isEditMode.value = false
  editingItem.value = null
}

const submitForm = () =>
  isEditMode.value ? updateHeadquarters() : createHeadquarters()


const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left" },
  { name: "abbreviation", label: "Abreviatura", field: "abbreviation", align: "left" },
  { name: "code", label: "Código", field: "code", align: "center" },
  { name: "address", label: "Dirección", field: "address", align: "left" },
  { name: "phone", label: "Teléfono", field: "phone", align: "center" },
  { name: "isActive", label: "Estado", field: "isActive", align: "center", format: val => val ? "Activa" : "Inactiva" },
  { name: "actions", label: "Acciones", field: "actions", align: "center" },
]

onMounted(() => {
  fetchSchools()
  fetchHeadquarters()
})
</script>
<style scoped>
.actionButtonContainer {
  margin-left: 960px;
}
</style>