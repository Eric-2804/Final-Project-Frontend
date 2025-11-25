import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createIndicador = (data) => {
  return postData(API_ENDPOINTS.INDICADORES.CREATE, data);
};

export const getAllIndicadores = () => {
  return getData(API_ENDPOINTS.INDICADORES.GET_ALL);
};

export const getIndicadorById = (id) => {
  return getData(`${API_ENDPOINTS.INDICADORES.GET_BY_ID}/${id}`);
};

export const updateIndicador = (id, data) => {
  return putData(`${API_ENDPOINTS.INDICADORES.UPDATE}/${id}`, data);
};

export const deleteIndicador = (id) => {
  return deleteData(`${API_ENDPOINTS.INDICADORES.DELETE}/${id}`);
};