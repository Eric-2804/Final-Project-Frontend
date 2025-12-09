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