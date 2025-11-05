<template>
    <div>
      <h2>Students Table</h2>
      <BaseTable
        :columns="studentColumns"
        :rows="studentRows"
        :actions="true"
        @edit="edit"
        @delete="deleteRow"
      />
    </div>
  </template>
  
  <script setup>
  import BaseTable from '@/components/tables.vue'
  
  const studentColumns = [
    { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
    { name: 'age', label: 'Edad', field: 'age', align: 'center' },
    { name: 'class', label: 'Curso', field: 'class', align: 'left' },
    { name: 'email', label: 'Email', field: 'email', align: 'left' },
    { name: 'phone', label: 'Telefono', field: 'phone', align: 'left' },
    { name: 'actions', label: 'Accion', field: 'actions', align: 'center' }
  ]
  
  const studentRows = [
    { name: 'Ana Gómez', age: 15, class: '10A', email: 'ana.gomez@email.com', phone: '3104567890' },
    { name: 'Luis Rodríguez', age: 16, class: '11B', email: 'luis.rodriguez@email.com', phone: '3129876543' },
    { name: 'María López', age: 14, class: '9C', email: 'maria.lopez@email.com', phone: '3204561237' },
    { name: 'Carlos Pérez', age: 17, class: '11A', email: 'carlos.perez@email.com', phone: '3006549871' },
    { name: 'Valentina Torres', age: 13, class: '8B', email: 'valentina.torres@email.com', phone: '3018529637' },
    { name: 'David Castro', age: 15, class: '10C', email: 'david.castro@email.com', phone: '3184567892' },
    { name: 'Laura Fernández', age: 16, class: '11C', email: 'laura.fernandez@email.com', phone: '3196541230' },
    { name: 'Mateo Jiménez', age: 14, class: '9A', email: 'mateo.jimenez@email.com', phone: '3158796541' },
    { name: 'Sara Martínez', age: 15, class: '10B', email: 'sara.martinez@email.com', phone: '3123457890' },
    { name: 'Andrés Rojas', age: 17, class: '11D', email: 'andres.rojas@email.com', phone: '3114789652' },
    { name: 'Camila Díaz', age: 13, class: '8A', email: 'camila.diaz@email.com', phone: '3221457896' },
    { name: 'Juan Herrera', age: 16, class: '11E', email: 'juan.herrera@email.com', phone: '3009857412' },
    { name: 'Daniela Ruiz', age: 14, class: '9B', email: 'daniela.ruiz@email.com', phone: '3198745123' },
    { name: 'Sebastián León', age: 15, class: '10D', email: 'sebastian.leon@email.com', phone: '3125487963' },
    { name: 'Natalia Vargas', age: 17, class: '11F', email: 'natalia.vargas@email.com', phone: '3106547891' },
    { name: 'Julián Mora', age: 13, class: '8C', email: 'julian.mora@email.com', phone: '3019658742' },
    { name: 'Isabella Gómez', age: 15, class: '10E', email: 'isabella.gomez@email.com', phone: '3179857412' },
    { name: 'Felipe Ortiz', age: 16, class: '11G', email: 'felipe.ortiz@email.com', phone: '3164587920' },
    { name: 'Lucía Ramírez', age: 14, class: '9D', email: 'lucia.ramirez@email.com', phone: '3129658741' },
    { name: 'Tomás Gil', age: 15, class: '10F', email: 'tomas.gil@email.com', phone: '3001254789' },
    { name: 'Sofía Cárdenas', age: 13, class: '8D', email: 'sofia.cardenas@email.com', phone: '3117896542' },
    { name: 'Emilio Torres', age: 14, class: '9E', email: 'emilio.torres@email.com', phone: '3154789621' },
    { name: 'Victoria Méndez', age: 15, class: '10G', email: 'victoria.mendez@email.com', phone: '3214569872' },
    { name: 'Diego Patiño', age: 17, class: '11H', email: 'diego.patino@email.com', phone: '3126547893' },
    { name: 'Gabriela Suárez', age: 16, class: '11I', email: 'gabriela.suarez@email.com', phone: '3109876541' },
    { name: 'Santiago Acosta', age: 14, class: '9F', email: 'santiago.acosta@email.com', phone: '3204789561' },
    { name: 'Martina Espinosa', age: 13, class: '8E', email: 'martina.espinosa@email.com', phone: '3117854692' },
    { name: 'Nicolás Navarro', age: 15, class: '10H', email: 'nicolas.navarro@email.com', phone: '3198741256' },
    { name: 'Valeria Moreno', age: 16, class: '11J', email: 'valeria.moreno@email.com', phone: '3224567890' },
    { name: 'Brayan Vega', age: 17, class: '11K', email: 'brayan.vega@email.com', phone: '3132589647' }
  ]
  
  function edit(row) {
    alert(`Editar ${row.name}`)
  }
  
  function deleteRow(row) {
    alert(`Eliminar${row.name}`)
  }
  </script>
  