import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { USUARIOS_COLEGIO } = API_ENDPOINTS;

// Crear usuario
export const createUser = (userData) => {
  return postData(
    `${USUARIOS_COLEGIO.BASE}${USUARIOS_COLEGIO.CREATE()}`,
    userData
  );
};

// Obtener todos los usuarios
export const getAllUsers = () => {
  return getData(
    `${USUARIOS_COLEGIO.BASE}${USUARIOS_COLEGIO.GET_ALL()}`
  );
};

// Obtener usuarios por rol
export const getUsersByRol = (rol) => {
  return getData(
    `${USUARIOS_COLEGIO.BASE}${USUARIOS_COLEGIO.GET_BY_ROL(rol)}`
  );
};

// Obtener usuario por ID
export const getUserById = (id) => {
  return getData(
    `${USUARIOS_COLEGIO.BASE}${USUARIOS_COLEGIO.GET_BY_ID(id)}`
  );
};

// Actualizar usuario
export const updateUser = (id, userData) => {
  return putData(
    `${USUARIOS_COLEGIO.BASE}${USUARIOS_COLEGIO.UPDATE(id)}`,
    userData
  );
};

// Eliminar usuario
export const deleteUser = (id) => {
  return deleteData(
    `${USUARIOS_COLEGIO.BASE}${USUARIOS_COLEGIO.DELETE(id)}`
  );
};
