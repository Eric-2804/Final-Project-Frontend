import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const createGroup = (sedeId, dataGroup) => {
  return postData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.CREATE(sedeId), dataGroup);
};

export const getAllGroupByYear = (year) => {
  return getData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.GET_ALL_BY_YEAR(year));
};

export const getGroupById = (id) => {
  return getData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.GET_BY_ID(id));
};

export const getGuardiansByGroup = (id) => {
  return getData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.GET_GUARDIAN_BY_GROUP(id));
};

export const getGroupsByHeadquarters = (sedeId) => {
  return getData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.GET_GROUP_BY_HEADQUARTERS(sedeId));
};

export const getStudentsByGroup = (id) => {
  return getData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.GET_STUDENT_BY_GROUP(id));
};

export const updateGroup = (id, dataGroup) => {
  return putData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.UPDATE(id), dataGroup);
};

export const activateGroup = (id) => {
  return putData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.ACTIVATE(id));
};

export const disableGroup = (id) => {
  return putData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.DISABLE(id));
};

export const deleteGroup = (id) => {
  return deleteData(API_ENDPOINTS.GROUPS.BASE + API_ENDPOINTS.GROUPS.DELETE(id));
};