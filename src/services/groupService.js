import { getData, putData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const getGroupsByYear = async (year) => {
  try {
    const url = `${API_ENDPOINTS.GRUPOS.BASE}/year/${year}`;
    console.log(`[groupService] Fetching groups from: ${url}`);
    const response = await getData(url);
    return response || [];
  } catch (error) {
    console.error('Error en getGroupsByYear:', error.response || error.message);
    return [];
  }
};

export const getStudentsByGroup = async (groupId) => {
  try {
    const url = `${API_ENDPOINTS.GRUPOS.BASE}/${groupId}/estudiantes`;
    console.log(`[groupService] Fetching students from: ${url}`);
    const response = await getData(url);
    return response || [];
  } catch (error) {
    console.error(`Error en getStudentsByGroup for group ${groupId}:`, error.response || error.message);
    return [];
  }
};

export const getGradesByGroup = async (groupId) => {
  try {
    const url = `/api/calificaciones/group/${groupId}`;
    console.log(`[groupService] Fetching grades from: ${url}`);
    const response = await getData(url);
    return response || [];
  } catch (error) {
    console.error(`Error en getGradesByGroup for group ${groupId}:`, error.response || error.message);
    return [];
  }
};

export const updateGroup = (id, data) => {
  return putData(`${API_ENDPOINTS.GRUPOS.BASE}/${id}`, data);
};