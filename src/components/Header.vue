<template>
  <q-header
    elevated
    class="header-fixed"
  >
    <q-toolbar>
      <q-toolbar-title>
        Institución Educativa
      </q-toolbar-title>

      <q-space />

      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn round dense flat color="white" icon="notifications" to="/notifications">
          <q-badge color="red" text-color="white" floating>
            2
          </q-badge>
          <q-tooltip>Notificaciones</q-tooltip>
        </q-btn>

        <q-btn-dropdown flat no-caps>
          <template v-slot:label>
            <div class="row items-center">
              <q-avatar size="26px" class="q-mr-sm">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
              <span>Administrador</span>
            </div>
          </template>

          <q-list style="min-width: 200px">
            <q-item>
              <q-item-section class="text-center flex-center">
                <q-avatar size="72px" class="q-mb-sm">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
                <div class="text-subtitle1">Juan Pérez</div>
                <div class="text-caption text-grey">juan.perez@example.com</div>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup to="/teacher/profile">
  <q-item-section avatar>
    <q-icon name="person" />
  </q-item-section>
  <q-item-section>
    <q-item-label>Mi Perfil</q-item-label>
  </q-item-section>
</q-item>


            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cerrar Sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
</script>

<style scoped>
.header-fixed {
  background-color: #1E40AF;
  color: white;
  z-index: 2000;
}
</style>