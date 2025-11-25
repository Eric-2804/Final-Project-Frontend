<template>
  <div>
    <h1>Dashboard del Rector</h1>
    <nav>
      <ul>
        <li><router-link to="/rector/direccion-nucleo">Gestión de Dirección de Núcleo</router-link></li>
        <li><router-link to="/rector/colegios">Gestión de Colegios</router-link></li>
        <li><router-link to="/rector/sedes">Gestión de Sedes</router-link></li>
        <li><router-link to="/rector/matriculas">Gestión de Matrículas</router-link></li>
        <li><router-link to="/rector/estructura-academica">Gestión de Estructura Académica</router-link></li>
        <li><router-link to="/rector/asignacion-docente">Gestión de Asignación Docente</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'DashboardRector'
}
</script>

<style scoped>
/* Estilos del componente */
nav ul {
  list-style-type: none;
  padding: 0;
}
nav ul li {
  display: inline-block;
  margin-right: 10px;
}
</style>