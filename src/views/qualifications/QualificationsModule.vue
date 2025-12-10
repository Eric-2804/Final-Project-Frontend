<template>
    <main-layout>
        <template #header>
            <q-toolbar>
                <q-btn flat round dense icon="arrow_back" to="/" />
                <q-toolbar-title> Módulo de Calificaciones </q-toolbar-title>
            </q-toolbar>
        </template>


        <q-page padding>
            <div class="row q-col-gutter-md">
                <q-card class="col-12 col-md-4">
                    <q-card-section>
                        <div class="text-h6">Acciones</div>
                    </q-card-section>
                    <q-list>
                        <q-item clickable v-ripple to="/qualifications/student">
                            <q-item-section>Ver calificaciones por estudiante</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/qualifications/group">
                            <q-item-section>Ver calificaciones por grupo</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/qualifications/create">
                            <q-item-section>Registrar calificación individual</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/qualifications/batch">
                            <q-item-section>Registrar calificaciones en lote</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/qualifications/generate">
                            <q-item-section>Generar calificaciones finales</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/qualifications/finals-by-year">
                            <q-item-section>Ver finales por año</q-item-section>
                        </q-item>
                        <q-item clickable v-ripple to="/qualifications/finals-by-group">
                            <q-item-section>Ver finales por grupo</q-item-section>
                        </q-item>
                    </q-list>
                </q-card>


                <div class="col-12 col-md-8">
                    <router-view />
                </div>
            </div>
        </q-page>
    </main-layout>
</template>


<script setup>
import MainLayout from '@/layouts/MainLayout.vue';
</script>