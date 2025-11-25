import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createGrupo = (grupoData) => {
  return postData(API_ENDPOINTS.GRUPOS.CREATE, grupoData);
};

export const getAllGrupos = () => {
  return getData(API_ENDPOINTS.GRUPOS.GET_ALL);
};

export const getGrupoById = (id) => {
  return getData(`${API_ENDPOINTS.GRUPOS.GET_BY_ID}/${id}`);
};

export const updateGrupo = (id, grupoData) => {
  return putData(`${API_ENDPOINTS.GRUPOS.UPDATE}/${id}`, grupoData);
};

export const deleteGrupo = (id) => {
  return deleteData(`${API_ENDPOINTS.GRUPOS.DELETE}/${id}`);
};