<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
    <q-card style="width: 600px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">{{ mode === 'create' ? 'Crear Grupo' : 'Editar Grupo' }}</div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md">

          <!-- VALIDACIÓN: Cada campo incluye rules para no permitir valores vacíos -->

          <q-input
            filled
            v-model="localForm.headquarters"
            label="Sede"
            :rules="[val => !!val || 'Este campo es obligatorio']"
          />

          <q-input
            filled
            v-model="localForm.year"
            label="Año"
            type="text"
            :rules="[
              val => !!val || 'Este campo es obligatorio',
              val => /^\\d{4}$/.test(val) || 'Debe ser un año válido'
            ]"
          />

          <q-input
            filled
            v-model="localForm.cycle"
            label="Ciclo"
            :rules="[val => !!val || 'Este campo es obligatorio']"
          />

          <q-input
            filled
            v-model="localForm.level"
            label="Nivel"
            :rules="[val => !!val || 'Este campo es obligatorio']"
          />

          <q-input
            filled
            v-model="localForm.grade"
            label="Grado"
            :rules="[val => !!val || 'Este campo es obligatorio']"
          />

          <q-input
            filled
            v-model="localForm.groupIdentifier"
            label="Identificador"
            :rules="[val => !!val || 'Este campo es obligatorio']"
          />

          <q-input
            filled
            v-model="localForm.session"
            label="Jornada"
            :rules="[val => !!val || 'Este campo es obligatorio']"
          />

          <q-input
            filled
            v-model="localForm.groupDirector"
            label="Director del grupo"
            :rules="[val => !!val || 'Este campo es obligatorio']"
          />

        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn flat label="Guardar" color="primary" @click="validateAndSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  mode: String,
  formData: Object
})

const emit = defineEmits(['update:modelValue', 'submit'])

// Creamos una copia local para permitir validaciones sin mutar directamente el padre hasta enviar
const localForm = reactive({
  headquarters: '',
  year: '',
  cycle: '',
  level: '',
  grade: '',
  groupIdentifier: '',
  session: '',
  groupDirector: '',
  _id: ''
})

// Cuando se abra el modal, sincronizamos los datos
watch(
  () => props.modelValue,
  (value) => {
    if (value) Object.assign(localForm, props.formData)
  }
)

function validateAndSubmit() {
  // Validación manual por si alguna regla no se ejecuta visualmente
  const required = [
    'headquarters', 'year', 'cycle', 'level', 'grade',
    'groupIdentifier', 'session', 'groupDirector'
  ]

  for (const field of required) {
    if (!localForm[field]) {
      alert(`El campo ${field} es obligatorio`)
      return
    }
  }

  // Copiar nuevamente al formData original
  Object.assign(props.formData, localForm)

  emit('submit')
}
</script>
