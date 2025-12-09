import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createCalificacion = (data) => {
  return postData(API_ENDPOINTS.CALIFICACIONES.CREATE, data);
};

export const getAllCalificaciones = () => {
  return getData(API_ENDPOINTS.CALIFICACIONES.GET_ALL);
};

export const getCalificacionById = (id) => {
  return getData(`${API_ENDPOINTS.CALIFICACIONES.GET_BY_ID}/${id}`);
};

export const updateCalificacion = (id, data) => {
  return putData(`${API_ENDPOINTS.CALIFICACIONES.UPDATE}/${id}`, data);
};

export const deleteCalificacion = (id) => {
  return deleteData(`${API_ENDPOINTS.CALIFICACIONES.DELETE}/${id}`);
};