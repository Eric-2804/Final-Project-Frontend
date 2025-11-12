<template>
  <q-scroll-area class="fit">
    <q-list>
      <EssentialLink
        v-for="link in teacherLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import EssentialLink from './EssentialLink.vue'

defineEmits(['toggle-mini'])

const teacherLinks = ref([
  {
    title: 'Dashboard',
    caption: 'Inicio',
    icon: 'dashboard',
    link: '/teacher/dashboard'
  },
  {
    title: 'Mis Grupos y Materias',
    caption: 'Tus grupos y materias',
    icon: 'group',
    link: '/teacher/groups'
  },
  {
    title: 'Indicadores de Desempeño',
    caption: 'Gestiona los indicadores',
    icon: 'assessment',
    link: '/teacher/performance-indicators'
  },
  {
    title: 'Reportes del Grupo',
    caption: 'Genera reportes',
    icon: 'article',
    link: '/teacher/group-reports'
  },
  {
    title: 'Comunicados',
    caption: 'Envía comunicados',
    icon: 'send',
    link: '/teacher/communications'
  }
])
</script>

<style scoped>

</style>