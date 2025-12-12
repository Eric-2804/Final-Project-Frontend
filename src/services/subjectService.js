import { getData, postData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { SUBJECTS } = API_ENDPOINTS;

export const getAllMateriasAreas = () => {
  return getData(SUBJECTS.BASE);
};

export const getMateriaAreaById = (id) => {
  return getData(`${SUBJECTS.BASE}${SUBJECTS.GET_BY_ID(id)}`);
};

export const getMateriasAreasByType = (type) => {
  return getData(`${SUBJECTS.BASE}${SUBJECTS.GET_BY_TYPE(type)}`);
};

export const getMateriasByArea = (areaCode) => {
  return getData(`${SUBJECTS.BASE}${SUBJECTS.GET_BY_AREA(areaCode)}`);
};

export const createMateriaArea = (data) => {
  return postData(`${SUBJECTS.BASE}${SUBJECTS.CREATE}`, data);
};

export const updateMateriaArea = (id, data) => {
  return putData(`${SUBJECTS.BASE}${SUBJECTS.UPDATE(id)}`, data);
};

export const activateMateriaArea = (id) => {
  return putData(`${SUBJECTS.BASE}${SUBJECTS.ACTIVATE(id)}`);
};

export const desactivateMateriaArea = (id) => {
  return putData(`${SUBJECTS.BASE}${SUBJECTS.DISABLE(id)}`);
};

export const deleteMateriaArea = (id) => {
  return deleteData(`${SUBJECTS.BASE}${SUBJECTS.DELETE(id)}`);
};

