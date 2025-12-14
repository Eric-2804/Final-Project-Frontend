# 🧪 GUÍA DE PRUEBAS - API DE MATRÍCULAS

**Fecha:** 11 de diciembre de 2025  
**Backend:** https://proyecto-final-ptwh.onrender.com/  
**Objetivo:** Verificar funcionalidad y populates de endpoints de matrículas

---

## 📋 PREPARACIÓN

### 1. Acceso a la vista de pruebas

1. Inicia el frontend: `npm run dev` (en `/front`)
2. Inicia sesión con usuario de secretaría
3. Accede a: **`http://localhost:5173/test/registration-api`**

### 2. Obtener IDs válidos para pruebas

Necesitas IDs reales del sistema. Puedes obtenerlos de dos formas:

**Opción A - Desde la base de datos (si tienes acceso):**
- ID de matrícula
- ID de estudiante
- ID de grupo
- ID de acudiente

**Opción B - Desde el frontend:**
1. Ve a cualquier vista que muestre matrículas/estudiantes
2. Abre las DevTools (F12) → pestaña Network
3. Busca llamadas a la API
4. Copia un ID de los datos de respuesta

---

## 🧪 PRUEBAS A REALIZAR

### FASE 1: Endpoints de Lectura (GET)

#### ✅ Test 1: Listar matrículas por año
- **Endpoint:** `GET /api/matriculas/year/:year`
- **Paso a paso:**
  1. En "Año para pruebas", pon: `2024` (o el año que uses)
  2. Expande: "📋 ENDPOINTS DE MATRÍCULAS"
  3. Clic en "Probar" del primer endpoint
  4. **Verificar:**
     - ✅ Retorna un array de matrículas
     - ✅ Campo `student` está poblado (tiene `names`, `lastNames`)
     - ✅ Campo `group` está poblado (tiene `level`, `grade`)
     - ✅ Campo `attendant` es un array con objetos poblados
     - ✅ Campo `school` está poblado (tiene `name`)

#### ✅ Test 2: Obtener matrícula por ID
- **Endpoint:** `GET /api/matriculas/:id`
- **Paso a paso:**
  1. Pega un ID válido de matrícula en "ID de prueba"
  2. Clic en "Probar" del segundo endpoint
  3. **Verificar:**
     - ✅ Retorna un solo objeto de matrícula
     - ✅ Todos los populates funcionan correctamente

#### ✅ Test 3: Matrículas por grupo
- **Endpoint:** `GET /api/matriculas/groups/:groupId/registrations`
- **Paso a paso:**
  1. Pega un ID válido de grupo
  2. Clic en "Probar"
  3. **Verificar:**
     - ✅ Retorna matrícula(s) del grupo

#### ✅ Test 4: Matrículas por estudiante
- **Endpoint:** `GET /api/matriculas/student/:studentId/registrations`
- **Paso a paso:**
  1. Pega un ID válido de estudiante
  2. Clic en "Probar"
  3. **Verificar:**
     - ✅ Retorna matrícula(s) del estudiante

#### ✅ Test 5: Obtener acudiente por ID
- **Endpoint:** `GET /api/matriculas/attendant/:attendantId/registration`
- **Paso a paso:**
  1. Expande: "👨‍👩‍👧 ENDPOINTS DE ACUDIENTES"
  2. Pega un ID válido de acudiente
  3. Clic en "Probar"
  4. **Verificar:**
     - ✅ Retorna datos del acudiente

---

## 📊 REGISTRO DE RESULTADOS

Completa esta tabla según los resultados:

| Endpoint | Estado | Populates OK | Notas |
|----------|--------|--------------|-------|
| GET /year/:year | ⬜ | ⬜ | |
| GET /:id | ⬜ | ⬜ | |
| GET /groups/:groupId | ⬜ | ⬜ | |
| GET /student/:studentId | ⬜ | ⬜ | |
| GET /attendant/:attendantId | ⬜ | ⬜ | |

**Leyenda:**
- ✅ Funciona correctamente
- ⚠️ Funciona con warnings
- ❌ No funciona

---

## 🔍 VERIFICACIÓN DE POPULATES

### ¿Qué verificar en cada populate?

**student (ref: users):**
```json
{
  "_id": "...",
  "names": "Juan",
  "lastNames": "Pérez",
  "typeDocument": "CC",
  "numberDocument": "123456"
}
```

**group (ref: Group):**
```json
{
  "_id": "...",
  "level": "PRIMARIA",
  "grade": "5",
  "groupIdentifier": "A",
  "session": "MAÑANA"
}
```

**attendant (array):**
```json
[
  {
    "_id": {
      "_id": "...",
      "names": "María",
      "lastNames": "Gómez",
      "cellphone": "3001234567"
    },
    "relationship": "madre"
  }
]
```

**school (ref: School):**
```json
{
  "_id": "...",
  "name": "Colegio XYZ"
}
```

---

## 🐛 ERRORES COMUNES

### Error 404 - Not Found
- **Causa:** ID no existe en la base de datos
- **Solución:** Verifica que el ID sea válido y esté activo

### Error 401 - Unauthorized
- **Causa:** Token expirado o no válido
- **Solución:** Vuelve a iniciar sesión

### Error 500 - Server Error
- **Causa:** Error en el backend (probablemente en Render)
- **Solución:** Revisa los logs del backend o espera un momento

### Populate no funciona
- **Síntoma:** Campos solo muestran IDs en lugar de objetos
- **Causa:** Backend no está haciendo populate correctamente
- **Nota:** Documentar cuáles no funcionan

---

## 📝 SIGUIENTE PASO

Una vez completadas las pruebas, documentar:

1. **Endpoints que funcionan al 100%**
2. **Endpoints con problemas**
3. **Populates que fallan**
4. **Cambios necesarios en el frontend**

---

## ⚠️ IMPORTANTE

- Esta es una **vista temporal** - NO hacer commit a producción
- Usar solo para pruebas de desarrollo
- Eliminar del router cuando termines las pruebas
- Los resultados ayudarán a diseñar las vistas reales

---

## 🎯 RESULTADO ESPERADO

Al finalizar deberías tener:
- ✅ Lista de endpoints funcionales
- ✅ Confirmación de qué populates funcionan
- ✅ Estructura de datos reales del backend
- ✅ Base para construir vistas reales

---

**¿Dudas?** Los resultados se muestran en la misma interfaz con formato JSON y badges de estado.
