<template>
  <q-layout view="lHh Lpr lFf"> 
    
    <div class="q-pa-sm bg-grey-3">
      <q-btn flat label="login" to="/" />
      <q-btn flat label="dashboard" to="/dashboardCoordinator" />
      <q-btn flat label="Perfil Estudiante" to="/perfil-Student" />
      <q-btn flat label="Dashboard Estudiante" to="/dashboard" />
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
