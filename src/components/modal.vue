<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
    <q-card style="width: 600px; max-width: 90vw;">

      <!-- TÍTULO -->
      <q-card-section>
        <div class="text-h6">
          {{ mode === 'create' ? 'Crear Grupo' : 'Editar Grupo' }}
        </div>
      </q-card-section>

      <!-- FORMULARIO -->
      <q-card-section>
        <q-form ref="formRef" @submit.prevent="onSubmit">

          <div class="row q-col-gutter-md">

            <!-- SEDE -->
            <div class="col-12">
              <q-select
                v-model="localForm.headquarters"
                :options="headquarters"
                option-value="_id"
                option-label="name"
                emit-value map-options
                label="Sede"
                outlined
                :rules="[val => !!val || 'La sede es obligatoria']"
              />
            </div>

            <!-- CICLO -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="localForm.cycle"
                :options="cycleOptions"
                label="Ciclo"
                outlined
                :rules="[val => !!val || 'El ciclo es obligatorio']"
              />
            </div>

            <!-- NIVEL -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="localForm.level"
                :options="levelOptions"
                label="Nivel"
                outlined
                @update:model-value="localForm.grade = ''"
                :rules="[val => !!val || 'El nivel es obligatorio']"
              />
            </div>

            <!-- GRADO -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="localForm.grade"
                :options="gradeOptions"
                label="Grado"
                outlined
                :disable="!localForm.level"
                :rules="[val => !!val || 'El grado es obligatorio']"
              />
            </div>

            <!-- IDENTIFICADOR -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="localForm.groupIdentifier"
                :options="identifierOptions"
                label="Identificador"
                outlined
                :rules="[val => !!val || 'El identificador es obligatorio']"
              />
            </div>

            <!-- JORNADA -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="localForm.session"
                :options="sessionOptions"
                label="Jornada"
                outlined
                :rules="[val => !!val || 'La jornada es obligatoria']"
              />
            </div>

            <!-- DIRECTOR (SOLO INSTRUCTORES) -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="localForm.groupDirector"
                :options="directorsFormatted"
                emit-value map-options
                label="Director del grupo"
                outlined
                :rules="[val => !!val || 'El director es obligatorio']"
              />
            </div>

          </div>

          <!-- BOTONES -->
          <div class="row q-mt-md justify-end">
            <q-btn flat label="Cancelar" color="grey-7" class="q-mr-sm" v-close-popup />
            <q-btn type="submit" color="primary" :label="mode === 'create' ? 'Crear grupo' : 'Guardar cambios'" />
          </div>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

/* PROPS */
const props = defineProps({
  modelValue: Boolean,
  mode: {
    type: String,
    default: 'create'
  },
  formData: {
    type: Object,
    required: true
  },
  headquarters: {
    type: Array,
    default: () => []
  },
  directors: {
    type: Array,
    default: () => []
  }
})

/* EMITS */
const emit = defineEmits(['update:modelValue', 'submit'])

/* FORM REF */
const formRef = ref(null)

/* FORM LOCAL */
const localForm = reactive({
  _id: '',
  headquarters: '',
  cycle: '',
  level: '',
  grade: '',
  groupIdentifier: '',
  session: '',
  groupDirector: ''
})

/* OPCIONES FIJAS */
const cycleOptions = ['normal', 'semestral']
const levelOptions = ['PRIMARIA', 'SECUNDARIA']
const sessionOptions = ['MAÑANA', 'TARDE', 'NOCHE']
const identifierOptions = ['A', 'B', 'C', 'D', 'E']

/* GRADOS DINÁMICOS SEGÚN NIVEL */
const gradeOptions = computed(() => {
  if (localForm.level === 'PRIMARIA') {
    return ['1°', '2°', '3°', '4°', '5°']
  }
  if (localForm.level === 'SECUNDARIA') {
    return ['6°', '7°', '8°', '9°', '10°', '11°']
  }
  return []
})

/* DIRECTORES FORMATEADOS (SIN FILTRO ERRÓNEO) */
const directorsFormatted = computed(() =>
  Array.isArray(props.directors)
    ? props.directors.map(user => ({
        value: user._id,
        label: `${user.names} ${user.lastNames}`
      }))
    : []
)

/* SINCRONIZAR AL ABRIR MODAL */
watch(
  () => props.modelValue,
  (open) => {
    if (open && props.formData) {
      Object.assign(localForm, props.formData)

      // Validación defensiva en edición
      const exists = directorsFormatted.value.some(
        d => d.value === localForm.groupDirector
      )

      if (!exists) {
        localForm.groupDirector = ''
      }
    }
  }
)

/* SUBMIT */
const onSubmit = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return

  Object.assign(props.formData, localForm)
  emit('submit')
}
</script>
