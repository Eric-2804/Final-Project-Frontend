<template>
  <div padding>
    <div v-if="loading" class="spinner-container">
      <Spinner />
    </div>
    <div v-else>
      <h1 class="q-ma-none q-mb-md">Indicadores de Desempeño</h1>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <h2 class="text-h6 q-ma-none">{{ editingIndicator ? 'Editar' : 'Crear' }} Indicador</h2>
            </q-card-section>
            <q-card-section>
              <q-form @submit.prevent="saveIndicator">
                <q-input v-model="indicatorForm.code" label="Código" required />
                <q-input v-model="indicatorForm.description" label="Descripción" type="textarea" required />
                <q-select
                  v-model="indicatorForm.category"
                  :options="['Saber', 'Hacer', 'Ser']"
                  label="Categoría"
                  required
                />
                <div class="actions-container">
                  <Button
                    v-if="editingIndicator"
                    label="Cancelar"
                    @click="cancelEdit"
                    color="secondary"
                    size="md"
                  />
                  <Button
                    :label="editingIndicator ? 'Actualizar' : 'Guardar'"
                    type="submit"
                    color="primary"
                    size="md"
                    icon="save"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-8">
          <tables
            :columns="columns"
            :rows="myIndicators"
            :actions="true"
            @edit="editIndicator"
            @toggleState="deleteIndicator"
          />
        </div>
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
  name: 'PerformanceIndicators',
  components: {
    tables,
    Spinner,
    Button,
  },
  setup() {
    const { showNotify, showErrorNotify } = useNotify();
    const loading = ref(true);
    const editingIndicator = ref(null);
    const myIndicators = ref([]);

    const indicatorForm = ref({
      code: '',
      description: '',
      category: '',
    });

    const columns = [
      { name: 'code', label: 'Código', align: 'left', field: 'code', sortable: true },
      { name: 'description', label: 'Descripción', align: 'left', field: 'description', style: 'white-space: normal;' },
      { name: 'category', label: 'Categoría', align: 'left', field: 'category', sortable: true },
      { name: 'actions', label: 'Acciones', align: 'center' },
    ];

    onMounted(() => {
      setTimeout(() => {
        myIndicators.value = [
          { id: 1, code: 'S-01', description: 'Identifica los componentes de un circuito eléctrico.', category: 'Saber', active: true, lastChange: '2024-01-01' },
          { id: 2, code: 'H-01', description: 'Construye un circuito simple.', category: 'Hacer', active: false, lastChange: '2024-01-02' },
        ];
        loading.value = false;
      }, 2000);
    });

    const saveIndicator = () => {
      if (editingIndicator.value) {
        const index = myIndicators.value.findIndex(ind => ind.id === editingIndicator.value.id);
        myIndicators.value[index] = { ...indicatorForm.value, id: editingIndicator.value.id, active: editingIndicator.value.active, lastChange: new Date().toISOString() };
        showNotify({ message: 'Indicador actualizado exitosamente' });
      } else {
        const newId = myIndicators.value.length > 0 ? Math.max(...myIndicators.value.map(i => i.id)) + 1 : 1;
        myIndicators.value.push({ ...indicatorForm.value, id: newId, active: true, lastChange: new Date().toISOString() });
        showNotify({ message: 'Indicador creado exitosamente' });
      }
      cancelEdit();
    };

    const editIndicator = (indicator) => {
      editingIndicator.value = indicator;
      indicatorForm.value = { ...indicator };
    };

    const deleteIndicator = (indicator) => {
      const index = myIndicators.value.findIndex(ind => ind.id === indicator.id);
      myIndicators.value[index].active = !myIndicators.value[index].active;
      showNotify({ message: `Indicador ${myIndicators.value[index].active ? 'habilitado' : 'inhabilitado'} exitosamente` });
    };

    const cancelEdit = () => {
      editingIndicator.value = null;
      indicatorForm.value = { code: '', description: '', category: '' };
    };

    return {
      loading,
      editingIndicator,
      indicatorForm,
      columns,
      myIndicators,
      saveIndicator,
      editIndicator,
      deleteIndicator,
      cancelEdit,
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