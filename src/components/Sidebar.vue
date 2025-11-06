<template>
  <q-drawer
    :model-value="leftDrawerOpen"
    @update:model-value="$emit('update:leftDrawerOpen')"
    show-if-above
    :width="250"
    :mini="mini"
    overlay

    style="background-color: #1E40AF; color: white; margin-top: 50px;"
  >
    <q-scroll-area class="fit">
      <q-list>

        <EssentialLink
          v-for="link in links"
          :key="link.title + leftDrawerOpen"
          v-bind="link"
        />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { defineComponent } from 'vue'
import EssentialLink from './EssentialLink.vue'

const linksList = [
  {
    title: 'Inicio',
    caption: 'Vista principal',
    icon: 'dashboard',
    link: '/'
  },
  {
    title: 'Calificaciones',
    caption: 'Consulta tus calificaciones',
    icon: 'grade',
    link: '/grades'
  },
  {
    title: 'Equipos',
    caption: 'Gestiona tus equipos',
    icon: 'groups',
    link: '/teams'
  },
  {
    title: 'Pagos',
    caption: 'Procesa los pagos',
    icon: 'payment',
    link: '/payments'
  },
  {
    title: 'Asistencia',
    caption: 'Control de asistencia',
    icon: 'event_available',
    link: '/attendance'
  },
  {
    title: 'Configuración',
    caption: 'Ajustes de la cuenta',
    icon: 'settings',
    link: '/settings'
  }
];

export default defineComponent({
  name: 'SidebarComponent',
  components: {
    EssentialLink
  },
  props: {
    leftDrawerOpen: {
      type: Boolean,
      required: true
    },
    mini: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:leftDrawerOpen'],
  setup () {
    return {
      links: linksList
    }
  }
})
</script>