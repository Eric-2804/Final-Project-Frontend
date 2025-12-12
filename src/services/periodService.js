import { getData, postData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { PERIODOS } = API_ENDPOINTS;

export const getAllPeriodos = () => {
  return getData(PERIODOS.BASE);
};

export const getPeriodoById = (id) => {
  return getData(`${PERIODOS.BASE}/${id}`);
};

export const getPeriodosByYear = (year) => {
  return getData(PERIODOS.BY_YEAR(year));
};

export const getActivePeriod = async (year) => {
  try {
    const url = PERIODOS.BY_YEAR(year);
    console.log(`URL construida para getActivePeriod: ${url}`);
    const periods = await getData(url);
    console.log('Períodos recibidos de la API:', periods);
    if (Array.isArray(periods)) {
      return periods.find(p => p.estado === 'activo');
    }
    return null;
  } catch (error) {
    console.error('Error en getActivePeriod:', error.message);
    // Workaround: Return a default period if the API call fails
    return { nombre: 'Período 2024 (Default)', numero: '2024-1' };
  }
};

export const createPeriodo = (data) => {
  return postData(PERIODOS.BASE, data);
};

export const updatePeriodo = (id, data) => {
  return putData(`${PERIODOS.BASE}/${id}`, data);
};

export const activatePeriodo = (id) => {
  return putData(PERIODOS.ACTIVATE(id));
};

export const deactivatePeriodo = (id) => {
  return putData(PERIODOS.DEACTIVATE(id));
};

export const deletePeriodo = (id) => {
  return deleteData(`${PERIODOS.BASE}/${id}`);
};