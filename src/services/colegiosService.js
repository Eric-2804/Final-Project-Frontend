import { getData, postData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { COLEGIOS } = API_ENDPOINTS;

export const getAllColegios = () => {
  return getData(COLEGIOS.BASE);
};

export const getColegioById = (id) => {
  return getData(`${COLEGIOS.BASE}/${id}`);
};

export const getColegiosByDireccion = (direccionId) => {
  return getData(COLEGIOS.BY_DIRECCION_NUCLEO(direccionId));
};

export const createColegio = (data) => {
  return postData(COLEGIOS.BASE, data);
};

export const createColegioByDireccion = (direccionId, data) => {
  return postData(COLEGIOS.BY_DIRECCION_NUCLEO(direccionId), data);
};

export const updateColegio = (id, data) => {
  return putData(`${COLEGIOS.BASE}/${id}`, data);
};

export const deleteColegio = (id) => {
  return deleteData(`${COLEGIOS.BASE}/${id}`);
};