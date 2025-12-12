import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createUser = (userData) => {
  return postData(API_ENDPOINTS.USERS.BASE, userData);
};

export const getAllUsers = () => {
  return getData(API_ENDPOINTS.USERS.BASE);
};

export const getUsersByRol = (rol) => {
  return getData(API_ENDPOINTS.USERS.GET_BY_ROL(rol));
};

export const getUserById = (id) => {
  return getData(`${API_ENDPOINTS.USUARIOS_COLEGIO.BASE}/${id}`);
};

export const updateUser = (id, userData) => {
  return putData(`${API_ENDPOINTS.USUARIOS_COLEGIO.UPDATE}/${id}`, userData);
};

export const deleteUser = (id) => {
  return deleteData(`${API_ENDPOINTS.USUARIOS_COLEGIO.DELETE}/${id}`);
};