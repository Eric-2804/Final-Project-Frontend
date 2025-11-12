<template>
  <div padding>
    <h1 class="q-ma-none q-mb-md">Grupos y Materias</h1>
    <tables
      :columns="columns"
      :rows="academicLoad"
      :actions="true"
      @edit="goToAcademicManagement"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import tables from '../../components/tables.vue';

export default {
  name: 'TeacherGroupsAndSubjects',
  components: {
    tables,
  },
  setup() {
    const router = useRouter();

    const columns = [
      { name: 'group', required: true, label: 'Grupo', align: 'left', field: 'group', sortable: true },
      { name: 'subject', required: true, label: 'Materia', align: 'left', field: 'subject', sortable: true },
      { name: 'schedule', label: 'Horario', align: 'left', field: 'schedule', sortable: false },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'id' },
    ];

    const academicLoad = ref([
      { id: 1, group: 'Grupo A', subject: 'Matemáticas', schedule: 'Lunes 8-10am', lastChange: '2024-01-01' },
      { id: 2, group: 'Grupo B', subject: 'Física', schedule: 'Martes 10-12am', lastChange: '2024-01-02' },
      { id: 3, group: 'Grupo C', subject: 'Química', schedule: 'Miércoles 8-10am', lastChange: '2024-01-03' },
    ]);

    const goToAcademicManagement = (row) => {
      router.push({ name: 'AcademicManagement', params: { groupId: row.id } });
    };

    return {
      columns,
      academicLoad,
      goToAcademicManagement,
    };
  },
};
</script>

<style scoped>

</style>