# 📚 GUÍA DE USO - registrationHelper.js

## ¿Por qué existe este helper?

El backend en Render **NO** popula automáticamente los datos relacionados. Retorna solo IDs:

```javascript
// ❌ Lo que retorna el backend:
{
  student: "6917ec45ac5ef097ac96abd7",  // Solo ID
  group: "6917ec45ac5ef097ac96abee",    // Solo ID
  school: "6917ec45ac5ef097ac96abc5"    // Solo ID
}

// ✅ Lo que necesitamos:
{
  student: {
    _id: "6917ec45ac5ef097ac96abd7",
    names: "Sofía",
    lastNames: "Navarro Reyes"
  },
  group: {
    _id: "6917ec45ac5ef097ac96abee",
    level: "SECUNDARIA",
    grade: "10"
  }
}
```

---

## 🚀 Uso en componentes Vue

### Ejemplo 1: Obtener una matrícula completa

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getFullRegistrationById, getFullName, getGroupLabel } from '@/services/registrationHelper'

const registration = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    // ✅ Obtener matrícula con TODOS los datos poblados
    registration.value = await getFullRegistrationById('6917ec46ac5ef097ac96ac0a')
    
    // Ahora puedes acceder a los datos completos:
    console.log(registration.value.student.names) // "Sofía"
    console.log(registration.value.group.level)   // "SECUNDARIA"
    
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="registration">
    <!-- Usar las funciones helper para mostrar datos -->
    <p>Estudiante: {{ getFullName(registration.student) }}</p>
    <p>Grupo: {{ getGroupLabel(registration.group) }}</p>
    <p>Colegio: {{ registration.school?.name || 'N/A' }}</p>
    
    <!-- Acudientes -->
    <div v-for="att in registration.attendant" :key="att._id">
      {{ getFullName(att._id) }} - {{ att.relationship }}
    </div>
  </div>
</template>
```

---

### Ejemplo 2: Listar matrículas por año

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getFullRegistrationsByYear, getFullName, getStateColor } from '@/services/registrationHelper'

const registrations = ref([])
const year = ref(2025)

async function loadRegistrations() {
  try {
    // ✅ Obtiene TODAS las matrículas del año con datos completos
    registrations.value = await getFullRegistrationsByYear(year.value)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadRegistrations()
})
</script>

<template>
  <q-table
    :rows="registrations"
    :columns="[
      { name: 'student', label: 'Estudiante', field: row => getFullName(row.student) },
      { name: 'group', label: 'Grupo', field: row => row.group?.grade || 'N/A' },
      { name: 'state', label: 'Estado', field: 'state' }
    ]"
  >
    <template v-slot:body-cell-state="props">
      <q-td>
        <q-chip :color="getStateColor(props.row.state)">
          {{ props.row.state }}
        </q-chip>
      </q-td>
    </template>
  </q-table>
</template>
```

---

### Ejemplo 3: Ver detalles de matrícula

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getFullRegistrationById, getFullName, getGroupLabel, getStateColor } from '@/services/registrationHelper'

const route = useRoute()
const registration = ref(null)

onMounted(async () => {
  const id = route.params.id
  registration.value = await getFullRegistrationById(id)
})
</script>

<template>
  <q-page padding>
    <q-card v-if="registration">
      <!-- Header con estado -->
      <q-card-section>
        <div class="text-h5">{{ getFullName(registration.student) }}</div>
        <q-chip :color="getStateColor(registration.state)">
          {{ registration.state }}
        </q-chip>
      </q-card-section>

      <q-separator />

      <!-- Datos del estudiante -->
      <q-card-section>
        <div class="text-h6">Estudiante</div>
        <p>Nombre: {{ registration.student.names }} {{ registration.student.lastNames }}</p>
        <p>Documento: {{ registration.student.numberDocument }}</p>
        <p>Email: {{ registration.student.email }}</p>
      </q-card-section>

      <!-- Datos del grupo -->
      <q-card-section>
        <div class="text-h6">Grupo</div>
        <p>{{ getGroupLabel(registration.group) }}</p>
        <p>Jornada: {{ registration.group.session }}</p>
      </q-card-section>

      <!-- Acudientes -->
      <q-card-section>
        <div class="text-h6">Acudientes</div>
        <q-list>
          <q-item v-for="att in registration.attendant" :key="att._id._id">
            <q-item-section>
              <q-item-label>{{ getFullName(att._id) }}</q-item-label>
              <q-item-label caption>{{ att.relationship }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>
```

---

## 🔧 Funciones disponibles

### Principales

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `getFullRegistrationById(id)` | Obtiene UNA matrícula completa | Object |
| `getFullRegistrationsByYear(year)` | Obtiene TODAS del año completas | Array |
| `getFullRegistrationByStudent(studentId)` | Matrícula de un estudiante | Object |
| `getFullRegistrationByGroup(groupId)` | Matrícula de un grupo | Object |

### Utilidades

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `getFullName(user)` | Nombre completo seguro | String |
| `getGroupLabel(group)` | Label del grupo | String |
| `getStateColor(state)` | Color según estado | String |

---

## ⚡ Ventajas

1. **No afecta código existente** - Es un archivo nuevo
2. **Opcional** - Úsalo solo si necesitas datos completos
3. **Rápido** - Hace peticiones en paralelo
4. **Seguro** - Maneja errores automáticamente
5. **Reutilizable** - Funciones helper para toda la app

---

## 🔄 Comparación

### ❌ Sin helper (solo IDs):
```javascript
const res = await registrationService.getById(id)
console.log(res.data.data.student) // "6917ec45..." (solo ID)
```

### ✅ Con helper (datos completos):
```javascript
const registration = await getFullRegistrationById(id)
console.log(registration.student.names) // "Sofía" (objeto completo)
```

---

## 📝 Notas importantes

- **NO modifica** `registrationService.js` existente
- **NO afecta** el trabajo de otros desarrolladores
- Es **compatible** con el código actual
- Puedes **no usarlo** y seguir con el servicio normal
- Las funciones helper son **opcionales**

---

## 🎯 ¿Cuándo usarlo?

- ✅ Cuando necesites mostrar nombres, no IDs
- ✅ En tablas con datos completos
- ✅ En detalles de matrícula
- ✅ En formularios de edición
- ❌ NO necesario si solo guardas/actualizas (usa el servicio normal)
