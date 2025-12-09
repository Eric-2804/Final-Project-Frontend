import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createMateriaArea = (data) => {
  return postData(API_ENDPOINTS.MATERIAS_AREAS.CREATE, data);
};

export const getAllMateriasAreas = () => {
  return getData(API_ENDPOINTS.MATERIAS_AREAS.GET_ALL);
};

export const getMateriaAreaById = (id) => {
  return getData(`${API_ENDPOINTS.MATERIAS_AREAS.GET_BY_ID}/${id}`);
};

export const updateMateriaArea = (id, data) => {
  return putData(`${API_ENDPOINTS.MATERIAS_AREAS.UPDATE}/${id}`, data);
};

export const deleteMateriaArea = (id) => {
  return deleteData(`${API_ENDPOINTS.MATERIAS_AREAS.DELETE}/${id}`);
};