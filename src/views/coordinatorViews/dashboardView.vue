<template>
  <q-layout view="lHh Lpr lFf">
    
    <HeaderComponent
      :leftDrawerOpen="leftDrawerOpen"
      :toggleLeftDrawer="toggleLeftDrawer"
    />

<<<<<<< HEAD
    <!-- Botones de navegación de vistas coordinador -->
    <div class="coordinator-nav-btns q-pa-md" style="background: #f5f6f8; display: flex; gap: 12px; justify-content: flex-end; align-items: center;">
      <q-btn label="Gestión de Grupos" color="primary" flat to="/groupManagementCoordinator" />
      <q-btn label="Inscripciones" color="primary" flat to="/registrationsCoordinator" />
      <q-btn label="Comunicados" color="primary" flat to="/pressReleasesCoordinator" />
      <q-btn label="Monitoreo" color="primary" flat to="/teacherMonitoringCoordinator" />
    </div>

    <!-- contenido -->
=======
    
    <SidebarComponent
      :leftDrawerOpen="leftDrawerOpen"
      :mini="mini"
      @update:leftDrawerOpen="leftDrawerOpen = $event"
    />

>>>>>>> e52e61627961e1b2d2badc3c8c710124268ca3bd
    <q-page-container>
      <q-page class="contenedor-cards">

        
        <div class="welcome_title">
          <h1>Bienvenido, Coordinador</h1>
        </div>

        <div class="cards-grid">
          
          <div class="card">
            <q-icon name="groups" size="40px" color="primary" />
            <h3>Grupos activos</h3>
            <p v-if="loadingGrupos">Cargando...</p>
<p v-else>{{ gruposActivos.length }}</p>


          </div>

         
          <div class="card">
            <q-icon name="school" size="40px" color="primary" />
            <h3>Estudiantes matriculados</h3>
            <p v-if="loadingMatriculas">Cargando...</p>
            <p v-else>{{ matriculas.length }}</p>
          </div>

          
          <div class="card">
            <q-icon name="bar_chart" size="40px" color="primary" />
            <h3>Promedio institucional</h3>
            <p>3.04</p>
          </div>

        
          <div class="card">
            <q-icon name="calendar_month" size="40px" color="primary" />
            <h3>Período activo</h3>
            <p v-if="loadingPeriodo">Cargando...</p>
            <p v-else-if="periodoActivo">{{ periodoActivo.year }} - {{ periodoActivo.name }}</p>
            <p v-else>No hay período activo</p>
          </div>
        </div>


      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import HeaderComponent from '../../components/Header.vue'
import SidebarComponent from '../../components/Sidebar.vue'
import { getPeriodoActivo, getMatriculasPorYear, getGruposActivos } from '../../services/cordinatorServices/coordinatorService'

// estados del layout
const leftDrawerOpen = ref(true)
const mini = ref(false)

// datos de la app
const periodoActivo = ref(null)
const loadingPeriodo = ref(true)

const matriculas = ref([])
const loadingMatriculas = ref(true)

const gruposActivos = ref([])
const loadingGrupos = ref(true)

// toggle drawer
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// cargar periodo activo
const cargarPeriodoActivo = async () => {
  loadingPeriodo.value = true
  try {
    const periodo = await getPeriodoActivo()
    periodoActivo.value = periodo
  } catch (error) {
    console.error('No se pudo cargar el período activo', error)
  } finally {
    loadingPeriodo.value = false
  }
}

// cargar matrículas por año
const cargarMatriculas = async (year) => {
  loadingMatriculas.value = true
  try {
    const data = await getMatriculasPorYear(year)
    matriculas.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error al cargar matrículas:', error)
    matriculas.value = []
  } finally {
    loadingMatriculas.value = false
  }
}

const cargarGrupos = async () => {
  loadingGrupos.value = true
  try {
    gruposActivos.value = await getGruposActivos()
  } catch (error) {
    console.error(error)
    gruposActivos.value = []
  } finally {
    loadingGrupos.value = false
  }
}




// al montar el componente
onMounted(() => {
  cargarPeriodoActivo()
  cargarGrupos()
})

// cuando se actualiza el periodo activo
watch(periodoActivo, (newPeriodo) => {
  if (newPeriodo) {
    cargarMatriculas(newPeriodo.year)
  }
})
</script>


<style scoped>
.q-page {
  padding-top: 0 !important;
}
.contenedor-cards {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 2rem;
}

.welcome_title {
  text-align: center;
}

.welcome_title h1 {
  color: #1e3a8a;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 0.3rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 90%;
  max-width: 1000px;
  margin-bottom: 2rem;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 180px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card h3 {
  color: #1e40af;
  font-size: 1.1rem;
  margin: 0.8rem 0 0.4rem 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card p {
  font-size: 1.8rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0;
}
</style>
