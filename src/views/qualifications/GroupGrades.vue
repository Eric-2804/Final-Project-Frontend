<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="row items-center q-gutter-md">
          <div class="col">
            <q-input v-model="groupId" label="ID Grupo" dense outlined />
          </div>
          <div class="col-auto">
            <q-input v-model.number="year" label="Año (opcional)" type="number" dense outlined />
          </div>
          <div class="col-auto">
            <q-btn label="Buscar" @click="fetch" color="primary" icon="search" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="rows"
          :columns="columns"
          :loading="loading"
          row-key="_id"
          flat
          bordered
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                dense
                flat
                round
                icon="edit"
                color="primary"
                @click="onEdit(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Editar calificación</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model.number="selected.grade" label="Nota" type="number" step="0.1" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" @click="editDialog = false" />
          <q-btn flat label="Guardar" color="primary" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getQualificationsByGroup, updateQualification } from '../../services/qualificationsSecretary.js';
import { useNotify } from '../../composables/useNotify.js';

const { showNotify, showErrorNotify } = useNotify();
const groupId = ref('');
const year = ref(new Date().getFullYear());
const rows = ref([]);
const loading = ref(false);
const editDialog = ref(false);
const selected = ref({});

const columns = [
  { name: 'student', label: 'Estudiante', field: row => `${row.student?.names || ''} ${row.student?.lastNames || ''}`.trim() || 'N/A', align: 'left' },
  { name: 'subject', label: 'Materia', field: row => row.subject?.name || 'N/A', align: 'left' },
  { name: 'period', label: 'Periodo', field: row => row.period?.nombre || 'N/A', align: 'left' },
  { name: 'grade', label: 'Nota', field: 'grade', align: 'center' },
  { name: 'year', label: 'Año', field: 'year', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' },
];

async function fetch() {
  if (!groupId.value) {
    showErrorNotify({ message: 'Por favor ingrese un ID de grupo' });
    return;
  }
  loading.value = true;
  try {
    const res = await getQualificationsByGroup(groupId.value, year.value);
    console.log('Respuesta del servidor:', res);
    // El backend devuelve array directo, no objeto con propiedad qualifications
    rows.value = Array.isArray(res) ? res : (res.qualifications || res.data || []);
    if (rows.value.length === 0) {
      showNotify({ message: 'No se encontraron calificaciones para este grupo' });
    } else {
      showNotify({ message: `Se encontraron ${rows.value.length} calificaciones` });
    }
  } catch (err) {
    console.error('Error al cargar calificaciones:', err);
    showErrorNotify({ message: 'Error al cargar calificaciones: ' + (err.response?.data?.msg || err.message) });
    rows.value = [];
  } finally { 
    loading.value = false; 
  }
}

function onEdit(row) {
  selected.value = { ...row };
  editDialog.value = true;
}

async function save() {
  try {
    const res = await updateQualification(selected.value._id, { grade: selected.value.grade });
    const idx = rows.value.findIndex(r => r._id === selected.value._id);
    if (idx !== -1) {
      rows.value[idx] = res.qualification || res.data || res;
    }
    editDialog.value = false;
    showNotify({ message: 'Calificación actualizada correctamente' });
  } catch (err) {
    showErrorNotify({ message: 'Error al actualizar: ' + (err.response?.data?.msg || err.message) });
  }
}
</script>
