<template>
  <q-layout view="lHh Lpr lFf">
    <!-- header -->
    <HeaderComponent
      :leftDrawerOpen="leftDrawerOpen"
      :toggleLeftDrawer="toggleLeftDrawer"
    />

    <!-- menú lateral -->
    <SidebarComponent
      :leftDrawerOpen="leftDrawerOpen"
      :mini="mini"
      @update:leftDrawerOpen="leftDrawerOpen = $event"
    />

    <!-- contenido principal -->
    <q-page-container>
      <q-page class="contenedor-cards">

        <!-- título de bienvenida -->
        <div class="welcome_title">
          <h1>Bienvenido, Coordinador</h1>
        </div>

        <div class="cards-grid">
          <!-- Grupos activos -->
          <div class="card">
            <q-icon name="groups" size="40px" color="primary" />
            <h3>Grupos activos</h3>
            <p>600</p>
          </div>

          <!-- Estudiantes matriculados -->
          <div class="card">
            <q-icon name="school" size="40px" color="primary" />
            <h3>Estudiantes matriculados</h3>
            <p v-if="loadingMatriculas">Cargando...</p>
            <p v-else>{{ matriculas.length }}</p>
          </div>

          <!-- Promedio institucional -->
          <div class="card">
            <q-icon name="bar_chart" size="40px" color="primary" />
            <h3>Promedio institucional</h3>
            <p>3.04</p>
          </div>

          <!-- Período activo -->
          <div class="card">
            <q-icon name="calendar_month" size="40px" color="primary" />
            <h3>Período activo</h3>
            <p v-if="loadingPeriodo">Cargando...</p>
            <p v-else-if="periodoActivo">{{ periodoActivo.year }} - {{ periodoActivo.name }}</p>
            <p v-else>No hay período activo</p>
          </div>
        </div>

        <!-- Lista de matrículas -->
        <div class="matriculas-list">
          <h2>Matrículas del período activo</h2>
          <p v-if="loadingMatriculas">Cargando matrículas...</p>
          <ul v-else>
            <li v-for="m in matriculas" :key="m._id">
              {{ m.studentName }} {{ m.studentLastname }} – {{ m.grade }}
            </li>
          </ul>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import HeaderComponent from '../../components/Header.vue'
import SidebarComponent from '../../components/Sidebar.vue'
import { getPeriodoActivo, getMatriculasPorYear } from '../../services/cordinatorServices/coordinatorService'

/* --- VARIABLES REACTIVAS --- */
const leftDrawerOpen = ref(true)
const mini = ref(false)
const periodoActivo = ref(null)
const loadingPeriodo = ref(true)
const matriculas = ref([])
const loadingMatriculas = ref(true)

/* --- FUNCIONES --- */
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

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

const cargarMatriculas = async (year) => {
  loadingMatriculas.value = true
  try {
    const data = await getMatriculasPorYear(year)
    matriculas.value = data
  } catch (error) {
    console.error('Error al cargar matrículas:', error)
    matriculas.value = []
  } finally {
    loadingMatriculas.value = false
  }
}

/* --- EJECUCIÓN --- */
onMounted(() => {
  cargarPeriodoActivo()
})

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

.matriculas-list {
  width: 90%;
  max-width: 1000px;
  margin-top: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.matriculas-list h2 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.matriculas-list ul {
  list-style: none;
  padding: 0;
}

.matriculas-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}
</style>
  