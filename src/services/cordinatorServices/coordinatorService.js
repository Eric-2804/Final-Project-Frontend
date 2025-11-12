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

