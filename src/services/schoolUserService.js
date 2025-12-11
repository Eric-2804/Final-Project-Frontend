import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createUser = (userData) => {
  return postData(API_ENDPOINTS.USUARIOS_COLEGIO.CREATE, userData);
};

export const getAllUsers = () => {
  return getData(API_ENDPOINTS.USUARIOS_COLEGIO.GET_ALL);
};

export const getUserById = (id) => {
  return getData(`${API_ENDPOINTS.USUARIOS_COLEGIO.BASE}`);
};

export const updateUser = (id, userData) => {
  return putData(`${API_ENDPOINTS.USUARIOS_COLEGIO.UPDATE}/${id}`, userData);
};

export const deleteUser = (id) => {
  return deleteData(`${API_ENDPOINTS.USUARIOS_COLEGIO.DELETE}/${id}`);
};