<template>
  <div class="dashboard-student">
    <h1>Bienvenido al Panel del Estudiante</h1>
    <p>Aquí podrás ver tus clases, notas y notificaciones.</p>
  </div>
</template>

<script>
export default {
  name: "DashboardStudent",
  setup() {
    console.log("Dashboard del estudiante cargado ✅")
  }
}
</script>

<style scoped>
.dashboard-student {
  padding: 2rem;
  text-align: center;
}

.dashboard-student h1 {
  color: #1a73e8;
  font-size: 24px;
}
</style>