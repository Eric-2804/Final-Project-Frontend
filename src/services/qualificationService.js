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

export const getByStudent = (studentId, year = null) => {
  const url = `${API_ENDPOINTS.QUALIFICATIONS.BASE}${API_ENDPOINTS.QUALIFICATIONS.GET_BY_STUDENT(studentId)}`;
  return getData(year ? `${url}?year=${year}` : url);
};

export const getByGroup = (groupId, year = null) => {
  const url = `${API_ENDPOINTS.QUALIFICATIONS.BASE}${API_ENDPOINTS.QUALIFICATIONS.GET_BY_GROUP(groupId)}`;
  return getData(year ? `${url}?year=${year}` : url);
};

export const updateQualification = (id, data) => {
  return putData(`${API_ENDPOINTS.QUALIFICATIONS.BASE}${API_ENDPOINTS.QUALIFICATIONS.UPDATE(id)}`, data);
};