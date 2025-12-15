import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { USERS } = API_ENDPOINTS;

export const createUser = (userData) => {
  // Usar el endpoint correcto según la especificación: POST /api/users/register
  return postData('/api/users/register', userData);
};

export const getAllUsers = () => {
  return getData(USERS.BASE || '/api/users');
};

export const getUsersByRol = (rol) => {
  return getData(USERS.GET_BY_ROL(rol));
};

export const getUsersByRole = (rol) => {
  return getData(USERS.GET_BY_ROL(rol));
};

export const getUserById = (id) => {
  return getData(USERS.GET_BY_ID(id));
};

export const updateUser = (id, userData) => {
  return putData(USERS.UPDATE(id), userData);
};

export const activateUser = (id) => {
  // Según la documentación del backend: POST /api/users/:id/activate
  // No requiere body
  return postData(USERS.ACTIVATE(id), {});
};

export const deactivateUser = (id) => {
  // Según la documentación del backend: POST /api/users/:id/deactivate
  // No requiere body
  return postData(USERS.DESACTIVATE(id), {});
};

export const deleteUser = (id) => {
  return deleteData(USERS.DELETE(id));
};