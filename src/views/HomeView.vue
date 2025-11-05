<template>
  <div>
    <h2>headquarters table</h2>

    <BaseTable :columns="columnsHeadquarters" :rows="rowsHeadquarters" :actions="true" @edit="edit"
      @toggleState="toggleState" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseTable from '@/components/tables.vue'

//  
const columnsHeadquarters = [
  { name: 'code', label: 'Codigo', field: 'code', align: 'left' },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
  { name: 'phone', label: 'Telefono', field: 'phone', align: 'center' },
  {
    name: 'lastChange',
    label: 'último cambio',
    align: 'center',
    field: row => formatDate(row.lastChange)
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
]


const rowsHeadquarters = ref([
  { code: 'S01', name: 'central', phone: '3121112222', active: true, lastChange: '2025-11-04T16:45:00' },
  { code: 'S02', name: 'norte', phone: '3203334444', active: false, lastChange: '2025-11-04T16:47:00' }
])


function edit(row) {
  alert(`editar ${row.name}`)
}


function formatDate(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const año = d.getFullYear()
  return `${dia}/${mes}/${año}`
}


function toggleState(row) {
  if (row.active) {
    row.active = false
    alert(`la sede "${row.name}" ha sido activada correctamente`)
  } else {
    row.active = true
    alert(`la sede "${row.name}" ha sido desactivada correctamente`)
  }
}
</script>
