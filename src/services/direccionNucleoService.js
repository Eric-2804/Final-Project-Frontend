import { getData, postData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { DIRECCION_NUCLEO } = API_ENDPOINTS;

export const getAllDireccionesNucleo = () => {
  return getData(DIRECCION_NUCLEO.BASE);
};

export const getDireccionNucleoById = (id) => {
  return getData(`${DIRECCION_NUCLEO.BASE}/${id}`);
};

export const createDireccionNucleo = (data) => {
  return postData(DIRECCION_NUCLEO.BASE, data);
};

export const loginDireccionNucleo = (credentials) => {
  return postData(DIRECCION_NUCLEO.LOGIN, credentials);
};

export const updateDireccionNucleo = (id, data) => {
  return putData(`${DIRECCION_NUCLEO.BASE}/${id}`, data);
};

export const changePassword = (id, passwords) => {
  return putData(DIRECCION_NUCLEO.CHANGE_PASSWORD(id), passwords);
};

export const deleteDireccionNucleo = (id) => {
  return deleteData(`${DIRECCION_NUCLEO.BASE}/${id}`);
};