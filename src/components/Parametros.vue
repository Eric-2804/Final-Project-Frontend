<template>
  <div class="q-pa-md">
    <q-table
      title="Parámetros"
      :rows="parametros"
      :columns="columns"
      row-key="_id"
    >
      <template v-slot:top-right>
        <q-btn color="primary" label="Crear Parámetro" @click="showCreateModal = true" />
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" @click="editParametro(props.row)" />
          <q-btn flat round icon="delete" @click="deleteParametro(props.row._id)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal de creación/edición -->
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Editar Parámetro' : 'Crear Parámetro' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.nombre" label="Nombre" />
          <q-input v-model="form.valor" label="Valor" />
          <q-input v-model="form.descripcion" label="Descripción" type="textarea" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat :label="isEdit ? 'Actualizar' : 'Crear'" @click="saveParametro" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllParametros, createParametro, updateParametro, deleteParametro as deleteParametroService } from '../../services/parametrosService';

const parametros = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const form = ref({
  _id: null,
  nombre: '',
  valor: '',
  descripcion: ''
});

const columns = [
  { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
  { name: 'valor', label: 'Valor', align: 'left', field: 'valor', sortable: true },
  { name: 'descripcion', label: 'Descripción', align: 'left', field: 'descripcion', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'right' }
];

onMounted(async () => {
  const response = await getAllParametros();
  parametros.value = response.data;
});

const editParametro = (parametro) => {
  form.value = { ...parametro };
  isEdit.value = true;
  showModal.value = true;
};

const saveParametro = async () => {
  if (isEdit.value) {
    await updateParametro(form.value._id, form.value);
  } else {
    await createParametro(form.value);
  }
  const response = await getAllParametros();
  parametros.value = response.data;
  showModal.value = false;
  isEdit.value = false;
  form.value = { _id: null, nombre: '', valor: '', descripcion: '' };
};

const deleteParametro = async (id) => {
  await deleteParametroService(id);
  const response = await getAllParametros();
  parametros.value = response.data;
};
</script>

<style scoped>
</style>