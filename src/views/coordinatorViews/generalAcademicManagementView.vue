<template>
    <q-layout view="lHh Lpr lFf">
      <!-- Header -->
      <HeaderComponent
        :leftDrawerOpen="leftDrawerOpen"
        :toggleLeftDrawer="toggleLeftDrawer"
      />
  
      <!-- Sidebar -->
      <SidebarComponent
        :leftDrawerOpen="leftDrawerOpen"
        :mini="mini"
        @update:leftDrawerOpen="leftDrawerOpen = $event"
      />
  
      <!-- Contenido principal -->
      <q-page-container>
        <q-page class="contenedor-vistas">
          <h1 class="title">Gestión Académica General</h1>
  
          <!-- Consultar calificaciones -->
          <section class="section">
            <h2>Consultar calificaciones</h2>
            <div class="filters">
              <q-select outlined label="Seleccionar grupo" :options="['Grupo A','Grupo B']" />
              <q-select outlined label="Seleccionar materia" :options="['Matemáticas','Historia']" />
              <q-select outlined label="Seleccionar estudiante" :options="['Juan','María']" />
            </div>
            <TablaAvanzada
              :columns="columnsCalificaciones"
              :rows="calificaciones"
              :actions="true"
              @edit="editarFila"
              @toggleState="toggleEstado"
            />
          </section>
  
          <!-- Generar reportes -->
          <section class="section">
            <h2>Generar reportes consolidados</h2>
            <div class="report-buttons">
              <q-btn label="Reporte por grupo" color="primary" />
              <q-btn label="Reporte por materia" color="secondary" />
              <q-btn label="Reporte por estudiante" color="accent" />
            </div>
          </section>
  
          <!-- Validar juicios valorativos -->
          <section class="section">
            <h2>Validar juicios valorativos</h2>
            <q-list bordered padding>
              <q-item v-for="item in juicios" :key="item.id">
                <q-item-section>{{ item.evaluacion }}</q-item-section>
                <q-item-section side>
                  <q-chip :color="item.validado ? 'green' : 'red'" outline>
                    {{ item.validado ? 'Validado' : 'Pendiente' }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </section>
  
          <!-- Verificación de cargas académicas -->
          <section class="section">
            <h2>Verificación de cargas académicas asignadas</h2>
            <TablaAvanzada
              :columns="columnsCargas"
              :rows="cargas"
              :actions="true"
              @edit="editarCarga"
              @toggleState="toggleEstadoCarga"
            />
          </section>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import HeaderComponent from '../../components/Header.vue'
  import SidebarComponent from '../../components/Sidebar.vue'
  import TablaAvanzada from '../../components/tables.vue'
  
  // layout
  const leftDrawerOpen = ref(true)
  const mini = ref(false)
  const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value
  
  // datos estáticos
  const calificaciones = [
    { id: 1, estudiante: 'Juan', materia: 'Matemáticas', calificacion: 4.5, lastChange: '2025-11-10' },
    { id: 2, estudiante: 'María', materia: 'Historia', calificacion: 3.8, lastChange: '2025-11-09' },
    { id: 3, estudiante: 'Pedro', materia: 'Matemáticas', calificacion: 4.2, lastChange: '2025-11-08' },
  ]
  
  const columnsCalificaciones = [
    { name: 'estudiante', label: 'Estudiante', field: 'estudiante' },
    { name: 'materia', label: 'Materia', field: 'materia' },
    { name: 'calificacion', label: 'Calificación', field: 'calificacion' },
    { name: 'actions', label: 'Acciones', field: 'actions', sortable: false }
  ]
  
  const juicios = [
    { id: 1, evaluacion: 'Examen Matemáticas - Juan', validado: true },
    { id: 2, evaluacion: 'Proyecto Historia - María', validado: false },
    { id: 3, evaluacion: 'Examen Matemáticas - Pedro', validado: true },
  ]
  
  const cargas = [
    { id: 1, docente: 'Profesor A', materia: 'Matemáticas', grupo: 'Grupo A', lastChange: '2025-11-11', active: true },
    { id: 2, docente: 'Profesor B', materia: 'Historia', grupo: 'Grupo B', lastChange: '2025-11-10', active: false },
    { id: 3, docente: 'Profesor C', materia: 'Ciencias', grupo: 'Grupo A', lastChange: '2025-11-09', active: true },
  ]
  
  const columnsCargas = [
    { name: 'docente', label: 'Docente', field: 'docente' },
    { name: 'materia', label: 'Materia', field: 'materia' },
    { name: 'grupo', label: 'Grupo', field: 'grupo' },
    { name: 'actions', label: 'Acciones', field: 'actions', sortable: false }
  ]
  
  // funciones para botones de las tablas
  function editarFila(row) {
    console.log('Editar calificación:', row)
  }
  
  function toggleEstado(row) {
    row.active = !row.active
  }
  
  function editarCarga(row) {
    console.log('Editar carga académica:', row)
  }
  
  function toggleEstadoCarga(row) {
    row.active = !row.active
  }
  </script>
  
  <style scoped>
  .contenedor-vistas {
    background-color: #f8fafc;
    min-height: 100vh;
    padding: 2rem;
  }
  
  .title {
    text-align: center;
    color: #1e3a8a;
    font-weight: bold;
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .section {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .report-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  </style>
  