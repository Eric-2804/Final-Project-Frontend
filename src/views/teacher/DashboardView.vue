<template>
  <div padding>
    <h1 class="q-ma-none q-mb-md">Inicio / Dashboard Docente</h1>

    <div class="row q-col-gutter-md">
      <!-- Listado de grupos y materias -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <h2 class="text-h6 q-ma-none">Grupos y Materias Asignadas</h2>
          </q-card-section>
          <q-list bordered separator>
            <q-item v-for="item in assignedSubjects" :key="item.id">
              <q-item-section>
                <q-item-label>{{ item.group }} - {{ item.subject }}</q-item-label>
                <q-item-label caption>Horario: {{ item.schedule }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round icon="chevron_right" @click="goToAcademicManagement(item.id)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Acceso rápido y estadísticas -->
      <div class="col-12 col-md-6">
        <q-card class="q-mb-md">
          <q-card-section>
            <h2 class="text-h6 q-ma-none">Acceso Rápido</h2>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="primary" label="Registrar Calificaciones" @click="goToAcademicManagement()" />
          </q-card-actions>
        </q-card>

        <q-card>
          <q-card-section>
            <h2 class="text-h6 q-ma-none">Estadísticas de Desempeño</h2>
          </q-card-section>
          <q-card-section>
            <!-- Aquí podrías usar gráficos -->
            <p>Gráfico de rendimiento por grupo...</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Avisos institucionales -->
    <q-card class="q-mt-md">
      <q-card-section>
        <h2 class="text-h6 q-ma-none">Avisos Institucionales</h2>
      </q-card-section>
      <q-list bordered separator>
        <q-item v-for="notice in institutionalNotices" :key="notice.id">
          <q-item-section>
            <q-item-label>{{ notice.title }}</q-item-label>
            <q-item-label caption>{{ notice.date }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'TeacherDashboard',
  setup() {
    const router = useRouter();

    const assignedSubjects = ref([
      { id: 1, group: 'Grupo A', subject: 'Matemáticas', schedule: 'Lunes 8-10am' },
      { id: 2, group: 'Grupo B', subject: 'Física', schedule: 'Martes 10-12am' },
    ]);

    const institutionalNotices = ref([
      { id: 1, title: 'Reunión de docentes', date: '2024-08-01' },
      { id: 2, title: 'Día de logros', date: '2024-08-15' },
    ]);

    const goToAcademicManagement = (groupId) => {
      const route = groupId ? { name: 'AcademicManagement', params: { groupId } } : { name: 'TeacherGroupsAndSubjects' };
      router.push(route);
    };

    return {
      assignedSubjects,
      institutionalNotices,
      goToAcademicManagement,
    };
  },
};
</script>

<style scoped>

</style>