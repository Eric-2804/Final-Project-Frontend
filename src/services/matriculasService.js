import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createMatricula = (matriculaData) => {
  return postData(API_ENDPOINTS.MATRICULAS.BASE, matriculaData);
};

export const getAllMatriculas = () => {
  return getData(API_ENDPOINTS.MATRICULAS.BASE);
};

export const getMatriculaById = (id) => {
  return getData(`${API_ENDPOINTS.MATRICULAS.BASE}/${id}`);
};

export const updateMatricula = (id, matriculaData) => {
  return putData(`${API_ENDPOINTS.MATRICULAS.BASE}/${id}`, matriculaData);
};

export const deleteMatricula = (id) => {
  return deleteData(`${API_ENDPOINTS.MATRICULAS.BASE}/${id}`);
};