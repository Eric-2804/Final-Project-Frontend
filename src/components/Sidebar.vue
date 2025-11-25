<template>
  <q-scroll-area class="fit">
    <q-list>
      <EssentialLink
        v-for="link in allLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { ref, defineEmits, computed } from 'vue'
import EssentialLink from './EssentialLink.vue'

defineEmits(['toggle-mini'])

const teacherLinks = ref([
  {
    title: 'Dashboard',
    caption: 'Inicio',
    icon: 'dashboard',
    link: '/teacherDashboard'
  },
  {
    title: 'Mis Grupos y Materias',
    caption: 'Tus grupos y materias',
    icon: 'group',
    link: '/teacherGroups'
  },
  {
    title: 'Indicadores de Desempeño',
    caption: 'Gestiona los indicadores',
    icon: 'assessment',
    link: '/teacherPerformanceIndicators'
  },
  {
    title: 'Reportes del Grupo',
    caption: 'Genera reportes',
    icon: 'article',
    link: '/teacherGroupReports'
  },
  {
    title: 'Comunicados',
    caption: 'Envía comunicados',
    icon: 'send',
    link: '/teacherCommunications'
  }
])

const managementLinks = ref([
  {
    title: 'Vigencia',
    caption: 'Gestiona vigencias',
    icon: 'calendar_today',
    link: '/management/vigencia'
  },
  {
    title: 'Periodo',
    caption: 'Gestiona periodos',
    icon: 'date_range',
    link: '/management/periodo'
  },
  {
    title: 'Materia y Área',
    caption: 'Gestiona materias y áreas',
    icon: 'class',
    link: '/management/materia-area'
  },
  {
    title: 'Grupo',
    caption: 'Gestiona grupos',
    icon: 'groups',
    link: '/management/grupo'
  },
  {
    title: 'Parámetros',
    caption: 'Gestiona parámetros',
    icon: 'settings',
    link: '/management/parametros'
  },
  {
    title: 'Indicadores',
    caption: 'Gestiona indicadores',
    icon: 'rule',
    link: '/management/indicadores'
  },
  {
    title: 'Matrícula',
    caption: 'Gestiona matrículas',
    icon: 'person_add',
    link: '/management/matricula'
  },
  {
    title: 'Carga Académica',
    caption: 'Gestiona la carga académica',
    icon: 'work',
    link: '/management/carga-academica'
  },
  {
    title: 'Calificación',
    caption: 'Gestiona calificaciones',
    icon: 'grading',
    link: '/management/calificacion'
  },
  {
    title: 'Usuarios Colegio',
    caption: 'Gestiona usuarios del colegio',
    icon: 'manage_accounts',
    link: '/management/usuarios-colegio'
  }
])

const allLinks = computed(() => {
  return [...teacherLinks.value, ...managementLinks.value]
})

</script>

<style scoped>

</style>