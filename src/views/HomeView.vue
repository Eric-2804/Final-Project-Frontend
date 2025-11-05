<template>
  <div>
    <h2>Headquarters Table</h2>
    <BaseTable
      :columns="columnsHeadquarters"
      :rows="rowsHeadquarters"
      :actions="true"
      @edit="edit"
      @delete="deleteRow"
    />
  </div>
</template>

<script setup>
import BaseTable from '@/components/tables.vue'

const columnsHeadquarters = [
  { name: 'code', label: 'Codigo', field: 'code', align: 'left' },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
  { name: 'phone', label: 'Telefono', field: 'phone', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
]

const rowsHeadquarters = [
  { code: 'S01', name: 'Central', phone: '3121112222' },
  { code: 'S02', name: 'Norte', phone: '3203334444' }
]

function edit(row) {
  alert(`Editar ${row.name}`)
}

function deleteRow(row) {
  alert(`Eliminar ${row.name}`)
}
</script>
