<template>
  <div>
    <q-banner dense>
      Envíe un arreglo JSON con las calificaciones. Ejemplo: [{school: 'id', student:'id', subject:'id', year:2025, noteType:'PERIOD', note:4.5}]
    </q-banner>
    <q-input type="textarea" v-model="jsonText" autogrow label="JSON del lote" />
    <div class="row q-gutter-sm q-mt-sm">
      <q-btn label="Enviar lote" color="primary" @click="send" />
      <q-btn label="Limpiar" flat @click="jsonText = ''" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['submit']);
const jsonText = ref('');
function send() {
  try {
    const arr = JSON.parse(jsonText.value);
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('Debe ser un array con al menos un elemento');
    emit('submit', arr);
  } catch (err) {
    emit('error', err.message || err);
  }
}
</script>