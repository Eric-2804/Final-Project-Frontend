<template>
  <q-card class="q-pa-md" style="max-width: 500px; width: 100%;">
    <q-card-section>
      <!-- Encabezado -->
      <div class="text-h6">{{ title }}</div>
      <div class="text-subtitle2 text-grey">{{ subtitle }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit.prevent="submitForm" class="q-gutter-md">

        <!-- Slot de campos -->
        <!-- Se pasa el form reactivo para que el padre lo use -->
        <slot name="fields" :form="form"></slot>

        <!-- Botones de acción -->
        <div class="row justify-end q-mt-md">
          <slot name="actions">
            <q-btn
              color="primary"
              :label="submitLabel"
              type="submit"
            />
            <q-btn
              flat
              color="grey-7"
              :label="cancelLabel"
              class="q-ml-sm"
              @click="$emit('cancel')"
            />
          </slot>
        </div>

      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reactive, toRaw } from 'vue'

/* Props */
const props = defineProps({
  title: { type: String, default: 'Formulario' },
  subtitle: { type: String, default: '' },
  submitLabel: { type: String, default: 'Guardar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  modelValue: { type: Object, default: () => ({}) } // Para pasar datos iniciales (ej. al editar)
})

/* Emit */
const emit = defineEmits(['submit', 'cancel', 'update:modelValue'])

/* Form reactivo */
const form = reactive({ ...props.modelValue })

/* Métodos */
function submitForm() {
  // Emitimos los datos al padre
  emit('submit', toRaw(form))
}

watch(
  () => props.modelValue,
  (newVal) => Object.assign(form, newVal)
)
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}
</style>
