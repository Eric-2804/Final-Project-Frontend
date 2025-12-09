import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createParametro = (data) => {
  return postData(API_ENDPOINTS.PARAMETROS.CREATE, data);
};

export const getAllParametros = () => {
  return getData(API_ENDPOINTS.PARAMETROS.GET_ALL);
};

export const getParametroById = (id) => {
  return getData(`${API_ENDPOINTS.PARAMETROS.GET_BY_ID}/${id}`);
};

export const updateParametro = (id, data) => {
  return putData(`${API_ENDPOINTS.PARAMETROS.UPDATE}/${id}`, data);
};

export const deleteParametro = (id) => {
  return deleteData(`${API_ENDPOINTS.PARAMETROS.DELETE}/${id}`);
};