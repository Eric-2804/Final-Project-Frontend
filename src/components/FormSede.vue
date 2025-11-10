<template>
  <q-form @submit.prevent="onSubmit" class="q-gutter-md">

    <!-- Nombre -->
    <q-input
      v-model="localForm.nombre"
      label="Nombre de la Sede"
      outlined
      dense
      :rules="[val => !!val || 'El nombre es requerido']"
    />

    <!-- Código -->
    <q-input
      v-model="localForm.codigo"
      label="Código de la Sede"
      outlined
      dense
      :disable="isEdit"
      :rules="[val => !!val || 'El código es requerido']"
    />

    <!-- Dirección -->
    <q-input
      v-model="localForm.direccion"
      label="Dirección"
      outlined
      dense
      :rules="[val => !!val || 'La dirección es requerida']"
    />

    <!-- Teléfono -->
    <q-input
      v-model="localForm.telefono"
      label="Teléfono"
      outlined
      dense
      :rules="[val => !!val || 'El teléfono es requerido']"
    />

    <!-- Coordinador -->
    <q-input
      v-model="localForm.coordinador"
      label="Coordinador"
      outlined
      dense
      :rules="[val => !!val || 'El Nombre de el Coordinador es requerido']"
    />

    <!-- Activa -->
    <div class="row items-center">
      <label class="text-subtitle2 col">Sede activa</label>
      <q-toggle v-model="localForm.activa" color="primary" />
    </div>

    <!-- Botones -->
    <div class="row justify-end q-gutter-sm q-mt-md">
      <q-btn label="Guardar" color="primary" type="submit" />
      <q-btn label="Cancelar" color="grey-7" flat @click="$emit('cancel')" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  initialData: Object,
});

const emit = defineEmits(["saved", "cancel"]);

const localForm = ref({
  nombre: "",
  codigo: "",
  direccion: "",
  telefono: "",
  coordinador: "",
  activa: true,
});

const isEdit = computed(() => !!props.initialData?.codigo);

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) localForm.value = { ...newVal };
  },
  { immediate: true }
);

function onSubmit() {
  emit("saved", { ...localForm.value });
}
</script>
