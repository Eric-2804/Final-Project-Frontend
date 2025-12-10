<template>
<q-form @submit.prevent="onSubmit" ref="formRef">
<div class="q-gutter-md">
<q-input v-model="payload.school" label="Colegio (ID)" dense required />
<q-input v-model="payload.student" label="Estudiante (ID)" dense required />
<q-input v-model="payload.subject" label="Materia (ID)" dense required />
<q-input v-model="payload.group" label="Grupo (ID)" dense />
<q-input v-model.number="payload.year" label="Año" type="number" dense required />


<q-select v-model="payload.noteType" :options="['PERIOD','FINAL']" label="Tipo de nota" dense required />


<q-input v-model.number="payload.note" label="Nota (0-5)" type="number" dense required />
<q-input v-model.number="payload.absences" label="Ausencias" type="number" dense />
<q-input v-model="payload.evaluativeJudgment" label="Juicio evaluativo" dense />
<q-input v-model="payload.observations" label="Observaciones" dense />


<div class="row q-gutter-sm">
<q-btn label="Guardar" color="primary" type="submit" />
<q-btn label="Cancelar" flat @click="$emit('cancel')" />
</div>
</div>
</q-form>
</template>


<script setup>
import { ref } from 'vue';
const props = defineProps({ model: { type: Object, default: () => ({}) } });
const emit = defineEmits(['save', 'cancel']);


const formRef = ref(null);
const payload = ref({
school: props.model.school || '',
student: props.model.student || '',
subject: props.model.subject || '',
group: props.model.group || '',
year: props.model.year || new Date().getFullYear(),
noteType: props.model.noteType || 'PERIOD',
note: props.model.note || 0,
absences: props.model.absences || 0,
evaluativeJudgment: props.model.evaluativeJudgment || '',
observations: props.model.observations || ''
});


function onSubmit() {
emit('save', JSON.parse(JSON.stringify(payload.value)));
}
</script>