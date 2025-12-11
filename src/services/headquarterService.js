import { getData, postData, putData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { SEDES } = API_ENDPOINTS;

export const getAllSedes = () => {
  return getData(SEDES.BASE);
};

export const getSedeById = (id) => {
  return getData(`${SEDES.BASE}/${id}`);
};

export const getSedesByColegio = (colegioId) => {
  return getData(SEDES.BY_COLEGIO(colegioId));
};

export const createSede = (data) => {
  return postData(SEDES.BASE, data);
};

export const updateSede = (id, data) => {
  return putData(`${SEDES.BASE}/${id}`, data);
};

export const activateSede = (id) => {
  return putData(SEDES.ACTIVATE(id), {});
};

export const deactivateSede = (id) => {
  return putData(SEDES.DEACTIVATE(id), {});
};