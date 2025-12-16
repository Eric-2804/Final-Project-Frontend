/**
 * 🔧 HELPER PARA MATRÍCULAS
 * 
 * Este archivo NO modifica registrationService.js existente.
 * Solo agrega funciones extras para obtener datos completos con "populate manual"
 * ya que el backend en Render no popula automáticamente.
 * 
 * USO:
 * - Si necesitas solo IDs → usa registrationService.js
 * - Si necesitas datos completos → usa este helper
 * 
 * NO AFECTA el código de otros desarrolladores.
 */

import registrationService from './registrationService.js'
import { getUserById } from './schoolUserService.js'
import { getGroupById } from './groupsService.js'
import { getColegioById } from './colegiosService.js'

/**
 * Obtiene una matrícula por ID con todos los datos poblados
 * @param {string} id - ID de la matrícula
 * @returns {Object} Matrícula con student, group, school y attendants completos
 */
export async function getFullRegistrationById(id) {
  try {
    // 1. Obtener matrícula básica
    const response = await registrationService.getById(id)
    const registration = response.data.data

    if (!registration) {
      throw new Error('Matrícula no encontrada')
    }

    // 2. Obtener datos relacionados en paralelo (más rápido)
    const promises = []
    
    // Student - solo buscar si es un ID (string), no un objeto
    if (registration.student) {
      const studentId = typeof registration.student === 'string' 
        ? registration.student 
        : registration.student._id
      
      // Solo hacer petición si es un ID y no tenemos el objeto completo
      if (typeof registration.student === 'string') {
        promises.push(
          getUserById(studentId)
            .then(res => ({ key: 'student', data: res.data }))
            .catch(() => ({ key: 'student', data: null }))
        )
      }
    }

    // Group - solo buscar si es un ID (string), no un objeto
    if (registration.group) {
      const groupId = typeof registration.group === 'string' 
        ? registration.group 
        : registration.group._id
      
      if (typeof registration.group === 'string') {
        promises.push(
          getGroupById(groupId)
            .then(res => ({ key: 'group', data: res.data }))
            .catch(() => ({ key: 'group', data: null }))
        )
      }
    }

    // School - solo buscar si es un ID (string), no un objeto
    if (registration.school) {
      const schoolId = typeof registration.school === 'string' 
        ? registration.school 
        : registration.school._id
      
      if (typeof registration.school === 'string') {
        promises.push(
          getColegioById(schoolId)
            .then(res => ({ key: 'school', data: res.data }))
            .catch(() => ({ key: 'school', data: null }))
        )
      }
    }

    // Attendants (array) - solo buscar si son IDs
    if (registration.attendant && Array.isArray(registration.attendant)) {
      registration.attendant.forEach((att, index) => {
        // Si att es un string, es solo el ID
        if (typeof att === 'string') {
          promises.push(
            getUserById(att)
              .then(res => ({ key: `attendant_${index}`, data: res.data, relationship: null }))
              .catch(() => ({ key: `attendant_${index}`, data: null, relationship: null }))
          )
        } 
        // Si att es un objeto con _id y aún no está poblado
        else if (att._id && typeof att._id === 'string' && !att.name) {
          promises.push(
            getUserById(att._id)
              .then(res => ({ key: `attendant_${index}`, data: res.data, relationship: att.relationship }))
              .catch(() => ({ key: `attendant_${index}`, data: null, relationship: att.relationship }))
          )
        }
      })
    }

    // 3. Esperar todas las peticiones
    const results = await Promise.all(promises)

    // 4. Combinar los resultados
    const populatedRegistration = { ...registration }

    results.forEach(result => {
      if (result.key === 'student') {
        populatedRegistration.student = result.data || registration.student
      } else if (result.key === 'group') {
        populatedRegistration.group = result.data || registration.group
      } else if (result.key === 'school') {
        populatedRegistration.school = result.data || registration.school
      } else if (result.key.startsWith('attendant_')) {
        const index = parseInt(result.key.split('_')[1])
        if (!populatedRegistration.attendant) {
          populatedRegistration.attendant = []
        }
        populatedRegistration.attendant[index] = {
          _id: result.data || registration.attendant[index]._id,
          relationship: result.relationship
        }
      }
    })

    return populatedRegistration

  } catch (error) {
    throw error
  }
}

/**
 * Obtiene todas las matrículas de un año con datos poblados
 * @param {number} year - Año de las matrículas
 * @returns {Array} Array de matrículas con datos completos
 */
export async function getFullRegistrationsByYear(year) {
  try {
    // 1. Obtener matrículas del año
    const response = await registrationService.getAllByYear(year)
    const registrations = response.data.data || []

    if (registrations.length === 0) {
      return []
    }

    // 2. Poblar cada matrícula (en paralelo para ser más rápido)
    const populatedPromises = registrations.map(reg => 
      getFullRegistrationById(reg._id).catch(err => {
        return reg // Retornar sin poblar si falla
      })
    )

    const populatedRegistrations = await Promise.all(populatedPromises)

    return populatedRegistrations

  } catch (error) {
    throw error
  }
}

/**
 * Obtiene matrícula de un estudiante con datos poblados
 * @param {string} studentId - ID del estudiante
 * @returns {Object} Matrícula completa
 */
export async function getFullRegistrationByStudent(studentId) {
  try {
    const response = await registrationService.getByStudent(studentId)
    const registration = response.data.data

    if (!registration || !registration._id) {
      return null
    }

    return await getFullRegistrationById(registration._id)

  } catch (error) {
    throw error
  }
}

/**
 * Obtiene matrículas de un grupo con datos poblados
 * @param {string} groupId - ID del grupo
 * @returns {Object} Matrícula del grupo completa
 */
export async function getFullRegistrationByGroup(groupId) {
  try {
    const response = await registrationService.getByGroup(groupId)
    const registration = response.data.data

    if (!registration || !registration._id) {
      return null
    }

    return await getFullRegistrationById(registration._id)

  } catch (error) {
    throw error
  }
}

/**
 * Función de utilidad para extraer nombres completos de forma segura
 * @param {Object} user - Objeto de usuario (student o attendant)
 * @returns {string} Nombre completo
 */
export function getFullName(user) {
  if (!user) return 'N/A'
  
  if (typeof user === 'string') return user // Es solo un ID
  
  const names = user.names || user.firstName || ''
  const lastNames = user.lastNames || user.lastName || ''
  
  return `${names} ${lastNames}`.trim() || 'Sin nombre'
}

/**
 * Función de utilidad para obtener label de grupo
 * @param {Object} group - Objeto de grupo
 * @returns {string} Label del grupo
 */
export function getGroupLabel(group) {
  if (!group) return 'N/A'
  
  if (typeof group === 'string') return group // Es solo un ID
  
  const level = group.level || ''
  const grade = group.grade || ''
  const identifier = group.groupIdentifier || ''
  
  return `${level} ${grade}${identifier}`.trim() || 'Sin grupo'
}

/**
 * Función de utilidad para obtener color según estado
 * @param {string} state - Estado de la matrícula
 * @returns {string} Color para Quasar
 */
export function getStateColor(state) {
  const colors = {
    'ACTIVO': 'positive',
    'RETIRADO': 'warning',
    'DESERTADO': 'negative',
    'GRADUADO': 'info'
  }
  return colors[state] || 'grey'
}
