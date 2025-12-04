import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createGrupo = (grupoData) => {
  return postData(API_ENDPOINTS.GRUPOS.BASE, grupoData);
};

export const getAllGrupos = () => {
  return getData(API_ENDPOINTS.GRUPOS.BASE);
};

export const getGrupoById = (id) => {
  return getData(`${API_ENDPOINTS.GRUPOS.BASE}/${id}`);
};

export const updateGrupo = (id, grupoData) => {
  return putData(`${API_ENDPOINTS.GRUPOS.BASE}/${id}`, grupoData);
};

export const deleteGrupo = (id) => {
  return deleteData(`${API_ENDPOINTS.GRUPOS.BASE}/${id}`);
};