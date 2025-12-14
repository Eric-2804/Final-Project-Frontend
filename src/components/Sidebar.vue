<template>
  <q-scroll-area class="fit custom-sidebar">
    <q-list>
      <template v-for="link in links" :key="link.title">
        <!-- Renderiza un menú desplegable si el enlace tiene hijos -->
        <q-expansion-item
          v-if="link.children && link.children.length > 0"
          :icon="link.icon"
          :label="link.title"
          class="text-white"
          header-class="text-white"
          expand-separator
        >
          <!-- Los elementos hijos van dentro de su propia q-list para un manejo correcto -->
          <q-list class="q-pl-md">
            <q-item
              v-for="child in link.children"
              :key="child.title"
              clickable
              :to="child.link"
              active-class="my-menu-link"
              class="text-white"
            >
              <q-item-section v-if="child.icon" avatar>
                <q-icon :name="child.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ child.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Renderiza un enlace normal si no tiene hijos -->
        <EssentialLink
          v-else
          v-bind="link"
        />
      </template>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import EssentialLink from './EssentialLink.vue';

const authStore = useAuthStore();
const userRole = computed(() => authStore.isAuthReady && authStore.user ? authStore.user.rol : null);

const linksByRole = {
 
  secretaria: [
    { title: 'Dashboard', icon: 'dashboard', link: '/secretaria/dashboard' },
    { title: 'Sedes', icon: 'business', link: '/secretaria/headquarters' },
    { title: 'Matrículas', icon: 'app_registration', link: '/secretaria/registrations' },
    { title: 'Gestión Académica', icon: 'work', link: '/secretaria/academicManagement' },
    { title: 'Profesores', icon: 'school', link: '/secretary/teacher' },
    { title: 'Grupos', icon: 'group', link: '/secretary/group' },
    { title: 'Áreas y Materias', icon: 'class', link: '/management/materia-area' },
    { title: 'Periodos', icon: 'event', link: '/secretaria/periodo' },
    // Comentadas temporalmente: rutas no implementadas aún
    // { title: 'Indicadores', icon: 'assessment', link: '/management/indicadores' },
    // { title: 'Vigencia', icon: 'today', link: '/management/vigencia' },
    // { title: 'Usuarios', icon: 'people', link: '/management/usuarios-colegio' },
    // {
    //   title: 'Configuraciones',
    //   icon: 'settings',
    //   children: [
    //     { title: 'Configurar Sistema', icon: 'settings_applications', link: '/configuracion/sistema' },
    //   ],
    // },
  ],
};

const links = computed(() => {
  const role = userRole.value;
  if (!role) return [];
  return linksByRole[role.toLowerCase()] || [];
});
</script>

<style lang="scss">
.custom-sidebar {
  background-color: #1E40AF;
  color: white;
}

/* Estilos para el enlace activo */
.my-menu-link {
  background-color: transparent !important;
  position: relative;
  color: #60a5fa !important; /* Color de texto azul claro para el enlace activo */
}

.my-menu-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 3px;
  background-color: #3B82F6;
}
</style>