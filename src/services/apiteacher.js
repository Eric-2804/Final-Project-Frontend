import { postData, getData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { USERS } = API_ENDPOINTS;

export const getUserById = (id) => getData(USERS.GET_BY_ID(id));
export const getUsersByRol = (rol) => getData(USERS.GET_BY_ROL(rol));

export const activateUser = (id) => postData(USERS.ACTIVATE(id));
export const desactivateUser = (id) => postData(USERS.DESACTIVATE(id));

export const changeUserPassword = (id, data) =>
  postData(USERS.CHANGE_PASSWORD(id), data);

export const updatePasswordRecovered = (data) =>
  putData(USERS.UPDATE_PASSWORD, data);

export const updateUser = (id, data) => putData(USERS.UPDATE(id), data);
export const deleteUser = (id) => deleteData(USERS.DELETE(id));

export const refreshToken = () => postData(USERS.REFRESH_TOKEN);
