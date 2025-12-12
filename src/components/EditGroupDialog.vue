<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Editar Grupo</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="groupData.name" label="Nombre del Grupo" autofocus />
        <q-input dense v-model="groupData.grade" label="Grado" />
        <q-input dense v-model="groupData.level" label="Nivel" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn flat label="Guardar" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  group: Object
});

const emit = defineEmits(['update:modelValue', 'save']);

const show = ref(props.modelValue);
const groupData = ref({});

watch(() => props.modelValue, (value) => {
  show.value = value;
  if (value) {
    groupData.value = { ...props.group };
  }
});

watch(show, (value) => {
  emit('update:modelValue', value);
});

const save = () => {
  emit('save', groupData.value);
  show.value = false;
};
</script>