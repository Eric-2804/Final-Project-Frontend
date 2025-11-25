import api from '../api'

// obtener el período activo
export const getPeriodoActivo = async () => {
  try {
    const response = await api.get('/api/periods')
    const periodos = response.data
    return periodos.find(p => p.active) || null
  } catch (error) {
    console.error('error al obtener el período activo:', error)
    throw error
  }
}

// obtener matrículas por año
export const getMatriculasPorYear = async (year) => {
  try {
    const response = await api.get(`/api/tuitions/year/${year}`)
    // aseguramos que siempre sea un array
    return Array.isArray(response.data) ? response.data : [response.data.data]
  } catch (error) {
    console.error('error al obtener matrículas:', error)
    throw error
  }
}

// obtener grupos activos
export const getGruposActivos = async () => {
  try {
    const res = await api.get('http://localhost:3000/api/groups/activos')
    if (!res.ok) throw new Error('Error al obtener grupos activos')
    const data = await res.json()
    // si tu backend devuelve { success, message, data }
    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error('error al obtener grupos activos:', error)
    return []
  }
}