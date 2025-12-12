import { getData, postData, putData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { HEADQUARTERS } = API_ENDPOINTS;

export const getAllSedes = () => {
   return getData(HEADQUARTERS.BASE + HEADQUARTERS.GET_ALL);
};

export const getSedeById = (id) => {
   return getData(HEADQUARTERS.BASE + HEADQUARTERS.GET_BY_ID(id));
};

export const getSedesByColegio = (colegioId) => {
  return getData(HEADQUARTERS.BASE + HEADQUARTERS.BY_COLEGIO(colegioId));
};

export const createSede = (data) => {
  return postData(HEADQUARTERS.BASE + HEADQUARTERS.CREATE, data);
};

export const updateSede = (id, data) => {
  return putData(HEADQUARTERS.BASE + HEADQUARTERS.UPDATE(id), data);
};

export const activateSede = (id) => {
  return putData(HEADQUARTERS.BASE + HEADQUARTERS.ACTIVATE(id), {});
};

export const deactivateSede = (id) => {
  return putData(HEADQUARTERS.BASE + HEADQUARTERS.DISABLE(id), {});
};