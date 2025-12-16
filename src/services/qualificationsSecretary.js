import api from './api.js'

// URL base relativa - api.js ya tiene configurado el baseURL completo
const API_URL = '/api/qualifications'

// ===============================
// CONSULTAS (GET)
// ===============================

// Obtener calificación por ID
export const getQualificationById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`)
  return response.data
}

// Calificaciones de un estudiante por año
export const getQualificationsByStudent = async (studentId, year) => {
  const response = await api.get(
    `${API_URL}/estudiantes/${studentId}/calificaciones`,
    { params: { year } }
  )
  return response.data
}

// Calificaciones de un grupo por año
export const getQualificationsByGroup = async (groupId, year) => {
  const response = await api.get(
    `${API_URL}/grupos/${groupId}/calificaciones`,
    { params: { year } }
  )
  return response.data
}

// Calificaciones por grupo y materia
export const getQualificationsByGroupAndSubject = async (groupId, subjectId, year) => {
  const response = await api.get(
    `${API_URL}/grupos/${groupId}/materias/${subjectId}/calificaciones`,
    { params: { year } }
  )
  return response.data
}

// ===============================
// CALIFICACIONES FINALES
// ===============================

// Calificaciones finales por año
export const getFinalQualificationsByYear = async (year) => {
  const response = await api.get(`${API_URL}/finales/${year}`)
  return response.data
}

// Calificaciones finales de un estudiante
export const getFinalQualificationsByStudent = async (studentId, year) => {
  const response = await api.get(
    `${API_URL}/estudiantes/${studentId}/calificaciones/finales`,
    { params: { year } }
  )
  return response.data
}

// Calificaciones finales de un grupo
export const getFinalQualificationsByGroup = async (groupId, year) => {
  const response = await api.get(
    `${API_URL}/grupos/${groupId}/calificaciones/finales`,
    { params: { year } }
  )
  return response.data
}

// ===============================
// REGISTRO (POST)
// ===============================

// Crear una calificación individual
export const createQualification = async (qualificationData) => {
  const response = await api.post(API_URL, qualificationData)
  return response.data
}

// Crear calificaciones en lote
export const createQualificationsBatch = async (batchData) => {
  const response = await api.post(`${API_URL}/lote`, batchData)
  return response.data
}

// Generar calificaciones finales
export const generateFinalQualifications = async (data) => {
  const response = await api.post(`${API_URL}/generar-finales`, data)
  return response.data
}

// ===============================
// ACTUALIZACIÓN (PUT)
// ===============================

// Actualizar calificación individual
export const updateQualification = async (id, updateData) => {
  const response = await api.put(`${API_URL}/${id}`, updateData)
  return response.data
}

// Actualizar calificación final
export const updateFinalQualification = async (id, updateData) => {
  const response = await api.put(`${API_URL}/finales/${id}`, updateData)
  return response.data
}