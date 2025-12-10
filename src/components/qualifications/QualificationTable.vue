<template>
<q-table
:columns="columns"
:rows="rows"
row-key="_id"
:loading="loading"
dense
flat
>
<template v-slot:body-cell-note="props">
<q-td :props="props">{{ props.row.note }}</q-td>
</template>
<template v-slot:body-cell-evaluativeJudgment="props">
<q-td :props="props">{{ props.row.evaluativeJudgment || '-' }}</q-td>
</template>
<template v-slot:body-cell-actions="props">
<q-td :props="props">
<q-btn size="sm" flat icon="edit" @click="$emit('edit', props.row)" />
</q-td>
</template>
</q-table>
</template>


<script setup>
import { computed } from 'vue';
const props = defineProps({ rows: { type: Array, default: () => [] }, loading: { type: Boolean, default: false } });
const emit = defineEmits(['edit']);


const columns = [
{ name: 'student', label: 'Estudiante', field: row => row.student?.name || row.student?.fullName || (row.student?._id || '-'), align: 'left' },
{ name: 'subject', label: 'Materia', field: row => row.subject?.name || row.subject?.title || '-' },
{ name: 'note', label: 'Nota', field: 'note' },
{ name: 'evaluativeJudgment', label: 'Juicio', field: 'evaluativeJudgment' },
{ name: 'absences', label: 'Ausencias', field: 'absences' },
{ name: 'actions', label: 'Acciones', field: 'actions' }
];
</script>