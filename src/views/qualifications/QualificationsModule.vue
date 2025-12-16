<template>
    <q-page padding>
        <div class="row q-col-gutter-md">
            <q-card class="col-12 col-md-4">
                <q-card-section>
                    <div class="text-h6">Módulo de Calificaciones</div>
                </q-card-section>
                <q-list>
                    <q-item clickable v-ripple @click="navigateTo('/secretaria/qualifications/student')">
                        <q-item-section avatar>
                            <q-icon name="person" />
                        </q-item-section>
                        <q-item-section>Ver calificaciones por estudiante</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="navigateTo('/secretaria/qualifications/group')">
                        <q-item-section avatar>
                            <q-icon name="group" />
                        </q-item-section>
                        <q-item-section>Ver calificaciones por grupo</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="navigateTo('/secretaria/qualifications/create')">
                        <q-item-section avatar>
                            <q-icon name="add" />
                        </q-item-section>
                        <q-item-section>Registrar calificación individual</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="navigateTo('/secretaria/qualifications/batch')">
                        <q-item-section avatar>
                            <q-icon name="playlist_add" />
                        </q-item-section>
                        <q-item-section>Registrar calificaciones en lote</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="navigateTo('/secretaria/qualifications/generate')">
                        <q-item-section avatar>
                            <q-icon name="calculate" />
                        </q-item-section>
                        <q-item-section>Generar calificaciones finales</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="navigateTo('/secretaria/qualifications/finals-by-year')">
                        <q-item-section avatar>
                            <q-icon name="calendar_today" />
                        </q-item-section>
                        <q-item-section>Ver finales por año</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="navigateTo('/secretaria/qualifications/finals-by-group')">
                        <q-item-section avatar>
                            <q-icon name="groups" />
                        </q-item-section>
                        <q-item-section>Ver finales por grupo</q-item-section>
                    </q-item>
                </q-list>
            </q-card>

            <div class="col-12 col-md-8">
                <router-view />
            </div>
        </div>
    </q-page>
</template>


<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>