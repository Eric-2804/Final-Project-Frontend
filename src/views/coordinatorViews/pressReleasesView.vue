<template>
  <MainLayout>
    <template #default>
      <div class="press-releases">
        <h1>Comunicados de Prensa</h1>
        <p>Aquí irán los comunicados de prensa</p>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../../layouts/MainLayout.vue'
</script>

<style scoped>
.press-releases {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1e1e1e;
  margin-bottom: 15px;
}

p {
  color: #6b7280;
}
</style>
