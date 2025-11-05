<template>
  <div>
    <h2>tabla de estudiantes</h2>
    <BaseTable
      :columns="studentColumns"
      :rows="studentRows"
      :actions="true"
      @edit="edit"
      @toggleState="toggleState"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseTable from '@/components/tables.vue'

// columnas
const studentColumns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
  { name: 'age', label: 'Edad', field: 'age', align: 'center' },
  { name: 'class', label: 'Curso', field: 'class', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'phone', label: 'Teléfono', field: 'phone', align: 'left' },
  {
    name: 'lastChange',
    label: 'Ultimo cambio',
    align: 'center',
    field: row => formatDate(row.lastChange)
  },
  { name: 'actions', label: 'Acción', field: 'actions', align: 'center' }
]


function formatDate(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}


const studentRows = ref([
  { name: 'ana gómez', age: 15, class: '10a', email: 'ana.gomez@email.com', phone: '3104567890', active: true, lastChange: '2025-11-04T16:45:00' },
  { name: 'luis rodríguez', age: 16, class: '11b', email: 'luis.rodriguez@email.com', phone: '3129876543', active: true, lastChange: '2025-11-04T14:22:00' },
  { name: 'maría lópez', age: 14, class: '9c', email: 'maria.lopez@email.com', phone: '3204561237', active: false, lastChange: '2025-11-03T10:10:00' },
  { name: 'carlos pérez', age: 17, class: '11a', email: 'carlos.perez@email.com', phone: '3006549871', active: true, lastChange: '2025-11-02T19:05:00' },
  { name: 'valentina torres', age: 13, class: '8b', email: 'valentina.torres@email.com', phone: '3018529637', active: false, lastChange: '2025-11-01T08:30:00' },
  { name: 'david castro', age: 15, class: '10c', email: 'david.castro@email.com', phone: '3184567892', active: true, lastChange: '2025-11-04T17:10:00' },
  { name: 'laura fernández', age: 16, class: '11c', email: 'laura.fernandez@email.com', phone: '3196541230', active: true, lastChange: '2025-11-03T22:00:00' },
  { name: 'mateo jiménez', age: 14, class: '9a', email: 'mateo.jimenez@email.com', phone: '3158796541', active: false, lastChange: '2025-10-30T11:45:00' },
  { name: 'sara martínez', age: 15, class: '10b', email: 'sara.martinez@email.com', phone: '3123457890', active: true, lastChange: '2025-11-04T09:00:00' },
  { name: 'andrés rojas', age: 17, class: '11d', email: 'andres.rojas@email.com', phone: '3114789652', active: true, lastChange: '2025-11-04T15:33:00' },
  { name: 'camila díaz', age: 13, class: '8a', email: 'camila.diaz@email.com', phone: '3221457896', active: false, lastChange: '2025-10-29T07:50:00' },
  { name: 'juan herrera', age: 16, class: '11e', email: 'juan.herrera@email.com', phone: '3009857412', active: true, lastChange: '2025-11-04T18:20:00' },
  { name: 'daniela ruiz', age: 14, class: '9b', email: 'daniela.ruiz@email.com', phone: '3198745123', active: true, lastChange: '2025-11-02T13:10:00' },
  { name: 'sebastián león', age: 15, class: '10d', email: 'sebastian.leon@email.com', phone: '3125487963', active: false, lastChange: '2025-11-03T09:15:00' },
  { name: 'natalia vargas', age: 17, class: '11f', email: 'natalia.vargas@email.com', phone: '3106547891', active: true, lastChange: '2025-11-01T21:00:00' },
  { name: 'isabella gómez', age: 15, class: '10e', email: 'isabella.gomez@email.com', phone: '3179857412', active: false, lastChange: '2025-10-31T17:40:00' },
  { name: 'felipe ortiz', age: 16, class: '11g', email: 'felipe.ortiz@email.com', phone: '3164587920', active: true, lastChange: '2025-11-04T12:15:00' },
  { name: 'lucía ramírez', age: 14, class: '9d', email: 'lucia.ramirez@email.com', phone: '3129658741', active: true, lastChange: '2025-11-02T09:25:00' },
  { name: 'tomás gil', age: 15, class: '10f', email: 'tomas.gil@email.com', phone: '3001254789', active: false, lastChange: '2025-10-28T19:10:00' },
  { name: 'sofia cárdenas', age: 13, class: '8d', email: 'sofia.cardenas@email.com', phone: '3117896542', active: true, lastChange: '2025-11-04T11:50:00' }
])


function edit(row) {
  alert(`editar ${row.name}`)
}

function toggleState(row) {
  if (row.active) {
    row.active = false
    row.lastChange = new Date().toISOString()
    alert(`el estudiante "${row.name}" ha sido desactivado correctamente`)
  } else {
    row.active = true
    row.lastChange = new Date().toISOString()
    alert(`el estudiante "${row.name}" ha sido activado correctamente`)
  }
}
</script>

