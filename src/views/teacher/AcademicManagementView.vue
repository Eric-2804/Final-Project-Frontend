<template>
  <div padding>
    <div v-if="loading" class="spinner-container">
      <Spinner />
    </div>
    <div v-else>
      <h1 class="q-ma-none q-mb-md">Gestión Académica</h1>
      <tables
        :columns="columns"
        :rows="students"
        :actions="false"
      />
      <div class="actions-container">
        <Button
          label="Registrar Calificaciones"
          @click="saveGrades"
          color="primary"
          size="md"
          icon="save"
        />
        <Button
          label="Registro en Lote"
          @click="batchRegister"
          color="secondary"
          size="md"
          icon="add_circle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useNotify } from '../../composables/useNotify.js';
import tables from '../../components/tables.vue';
import Spinner from '../../components/Spinner.vue';
import Button from '../../components/Button.vue';

export default {
  name: 'AcademicManagement',
  components: {
    tables,
    Spinner,
    Button,
  },
  setup() {
    const { showNotify, showErrorNotify } = useNotify();
    const loading = ref(true);
    const students = ref([]);

    const columns = [
      { name: 'name', required: true, label: 'Estudiante', align: 'left', field: 'name', sortable: true },
      { name: 'grade', label: 'Calificación', align: 'center', field: 'grade', sortable: true },
      { name: 'absences', label: 'Inasistencias', align: 'center', field: 'absences', sortable: true },
    ];

    onMounted(() => {
      setTimeout(() => {
        students.value = [
          { id: 1, name: 'Estudiante 1', grade: 4.5, absences: 0, lastChange: '2024-01-01' },
          { id: 2, name: 'Estudiante 2', grade: 3.0, absences: 2, lastChange: '2024-01-02' },
          { id: 3, name: 'Estudiante 3', grade: 5.0, absences: 0, lastChange: '2024-01-03' },
        ];
        loading.value = false;
      }, 2000);
    });

    const saveGrades = () => {
      showNotify('Calificaciones guardadas exitosamente');
    };

    const batchRegister = () => {
      showErrorNotify('Error al registrar en lote');
    };

    return {
      loading,
      students,
      columns,
      saveGrades,
      batchRegister,
    };
  },
};
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.actions-container > * {
  margin-left: 10px;
}

</style>