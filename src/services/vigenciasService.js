import { getData, postData, putData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { VIGENCIAS } = API_ENDPOINTS;

export const getAllVigencias = () => {
  return getData(VIGENCIAS.BY_YEAR);
};

export const getActiveVigencia = () => {
  return getData(VIGENCIAS.ACTIVE);
};

export const createVigencia = (data) => {
  return postData(VIGENCIAS.BASE, data);
};

export const activateVigencia = (id) => {
  return putData(VIGENCIAS.ACTIVATE(id));
};

export const deactivateVigencia = (id) => {
  return putData(VIGENCIAS.DEACTIVATE(id));
};