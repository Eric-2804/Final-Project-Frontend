<template>
  <q-page padding>
    <h1 class="q-ma-none q-mb-md">Informes de Grupo</h1>
    <q-card>
      <q-card-section>
        <h2 class="text-h6 q-ma-none">Generar Informe</h2>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="generateReport">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-select
                v-model="selectedGroup"
                :options="groups"
                label="Seleccionar Grupo"
                required
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="selectedPeriod"
                :options="periods"
                label="Seleccionar Período"
                required
              />
            </div>
          </div>
          <div class="actions-container q-mt-md">
            <Button
              label="Generar Informe"
              type="submit"
              color="primary"
              size="md"
              icon="assessment"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-separator v-if="reportGenerated" />

      <q-card-section v-if="reportGenerated">
        <h2 class="text-h6 q-ma-none">Informe Generado</h2>
        <p class="q-mt-md"><strong>Grupo:</strong> {{ generatedReport.group }}</p>
        <p><strong>Período:</strong> {{ generatedReport.period }}</p>
        <p>A continuación, se muestra una vista previa del informe. Puede exportarlo en formato PDF o Excel.</p>
        <div class="actions-container q-mt-md">
          <Button
            label="Exportar a PDF"
            @click="exportToPDF"
            color="secondary"
            size="md"
            icon="picture_as_pdf"
          />
          <Button
            label="Exportar a Excel"
            @click="exportToExcel"
            color="positive"
            size="md"
            icon="table_chart"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useNotify } from '../../composables/useNotify.js';
import Button from '../../components/Button.vue';

export default {
  name: 'GroupReports',
  components: {
    Button,
  },
  setup() {
    const { showNotify, showErrorNotify } = useNotify();
    const selectedGroup = ref(null);
    const selectedPeriod = ref(null);
    const reportGenerated = ref(false);
    const generatedReport = ref({});

    const groups = ['Grupo 101', 'Grupo 102', 'Grupo 201'];
    const periods = ['Período 1', 'Período 2', 'Período 3', 'Período 4'];

    const generateReport = () => {
      if (selectedGroup.value && selectedPeriod.value) {
        reportGenerated.value = true;
        generatedReport.value = {
          group: selectedGroup.value,
          period: selectedPeriod.value,
        };
        showNotify({ message: 'Informe generado exitosamente' });
      } else {
        showErrorNotify({ message: 'Por favor, seleccione un grupo y un período' });
      }
    };

    const exportToPDF = () => {
      showNotify({ message: 'Exportando a PDF...' });
    };

    const exportToExcel = () => {
      showNotify({ message: 'Exportando a Excel...' });
    };

    return {
      selectedGroup,
      selectedPeriod,
      groups,
      periods,
      reportGenerated,
      generatedReport,
      generateReport,
      exportToPDF,
      exportToExcel,
    };
  },
};
</script>

<style scoped>
.actions-container {
  display: flex;
  justify-content: flex-end;
}

.actions-container > * {
  margin-left: 10px;
}
</style>