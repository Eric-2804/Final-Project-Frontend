<template>
  <q-page padding>
    <h2 class="text-h5 q-mb-md">Listado de colegios</h2>

    <div class="row q-col-gutter-md">
      <div
        v-for="colegio in colegios"
        :key="colegio._id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6">{{ colegio.name }}</div>
            <div class="text-caption text-grey">Código: {{ colegio.code }}</div>
          </q-card-section>

          <q-card-section>
            <p><b>Dirección:</b> {{ colegio.address }}</p>
            <p><b>Tel:</b> {{ colegio.phone }}</p>
            <p><b>Email:</b> {{ colegio.email }}</p>
            <p>
              <b>Estado:</b>
              <q-badge :color="colegio.active ? 'green' : 'red'">
                {{ colegio.active ? "Activo" : "Inactivo" }}
              </q-badge>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <p v-if="colegios.length === 0">No hay colegios disponibles</p>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getColegios } from "@/services/cordinatorServices/Schools.js";

const colegios = ref([]);

onMounted(async () => {
  try {
    const data = await getColegios();
    console.log("COLEGIOS QUE LLEGAN → ", data);
    colegios.value = data;
  } catch (error) {
    console.error("Error cargando colegios:", error);
  }
});
</script>
