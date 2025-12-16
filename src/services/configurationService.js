import api from './api';
import { API_ENDPOINTS } from './apiEndpoints';

/**
 * Obtiene la configuración de un colegio por su ID.
 * @param {string} schoolId - El ID del colegio.
 * @returns {Promise} - La promesa de la respuesta de la API.
 */
export const getConfigurationBySchool = (schoolId) => {
  return api.get(API_ENDPOINTS.CONFIGURATIONS.GET_BY_SCHOOL(schoolId));
};

/**
 * Guarda o actualiza la configuración de un colegio.
 * @param {string} schoolId - El ID del colegio.
 * @param {object} configData - Los datos de configuración a guardar.
 * @returns {Promise} - La promesa de la respuesta de la API.
 */
export const saveConfiguration = (schoolId, configData) => {
  return api.put(API_ENDPOINTS.CONFIGURATIONS.CREATE_OR_UPDATE(schoolId), configData);
};