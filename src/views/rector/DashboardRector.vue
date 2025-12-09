<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row q-col-gutter-md">
      <div v-for="(card, index) in cards" :key="card.title" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card 
          class="cursor-pointer full-height" 
          @click="$router.push(card.link)"
          :class="`bg-${cardColors[index % cardColors.length]}-1`"
          flat 
          bordered
        >
          <q-card-section class="text-center">
            <q-icon :name="card.icon" size="4em" :class="`text-${cardColors[index % cardColors.length]}-8`" />
          </q-card-section>
          <q-card-section class="text-center">
            <div class="text-h6">{{ card.title }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const cards = ref([
  { title: 'Dirección Núcleo', icon: 'device_hub', link: '/rector/direccion-nucleo' },
  { title: 'Colegios', icon: 'school', link: '/rector/colegios' },
  { title: 'Sedes', icon: 'business', link: '/rector/sedes' },
  { title: 'Matrículas', icon: 'person_add', link: '/rector/matriculas' },
  { title: 'Estructura Académica', icon: 'schema', link: '/rector/estructura-academica' },
  { title: 'Asignación Docente', icon: 'assignment_ind', link: '/rector/asignacion-docente' },
]);

const cardColors = ['blue', 'green', 'orange', 'purple', 'red', 'teal'];
</script>

<style scoped>
.q-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
}
.q-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>