import { getData, postData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { USERS } = API_ENDPOINTS;

export const getUsersByRol = (rol) => getData(USERS.GET_BY_ROL(rol));
