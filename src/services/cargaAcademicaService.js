import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createCargaAcademica = (data) => {
  return postData(API_ENDPOINTS.CARGA_ACADEMICA.CREATE, data);
};

export const getAllCargasAcademicas = () => {
  return getData(API_ENDPOINTS.CARGA_ACADEMICA.GET_ALL);
};

export const getCargaAcademicaById = (id) => {
  return getData(`${API_ENDPOINTS.CARGA_ACADEMICA.GET_BY_ID}/${id}`);
};

export const updateCargaAcademica = (id, data) => {
  return putData(`${API_ENDPOINTS.CARGA_ACADEMICA.UPDATE}/${id}`, data);
};

export const deleteCargaAcademica = (id) => {
  return deleteData(`${API_ENDPOINTS.CARGA_ACademica.DELETE}/${id}`);
};