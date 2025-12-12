import api from "./api.js";
import { API_ENDPOINTS } from './apiEndpoints.js';

const BASE = API_ENDPOINTS.REGISTRATIONS.BASE;

export default {
  // Obtener matrículas por año
  getAllByYear(year) {
    return api.get(`${BASE}${API_ENDPOINTS.REGISTRATIONS.GET_BY_YEAR(year)}`);
  },

  // Obtener una matrícula por ID
  getById(id) {
    return api.get(`${BASE}${API_ENDPOINTS.REGISTRATIONS.GET_BY_ID(id)}`);
  },

  // Obtener matrículas por acudiente
  getByAttendant(attendantId) {
    return api.get(`${BASE}/students-by-attendant/${attendantId}`);
  },

  // Obtener matrículas por estudiante
  getByStudent(studentId) {
    return api.get(`${BASE}${API_ENDPOINTS.REGISTRATIONS.GET_BY_STUDENT(studentId)}`);
  },

  // Obtener matrículas por grupo
  getByGroup(groupId) {
    return api.get(`${BASE}${API_ENDPOINTS.REGISTRATIONS.GET_BY_GROUP(groupId)}`);
  },

  // Crear matrícula
  create(data) {
    return api.post(`${BASE}${API_ENDPOINTS.REGISTRATIONS.CREATE}`, data);
  },

  // Actualizar matrícula
  update(id, data) {
    return api.put(`${BASE}${API_ENDPOINTS.REGISTRATIONS.UPDATE(id)}`, data);
  },

  // Cambios de estado
  activate(id) {
    return api.put(`${BASE}${API_ENDPOINTS.REGISTRATIONS.ACTIVATE(id)}`);
  },

  desactivate(id) {
    return api.put(`${BASE}${API_ENDPOINTS.REGISTRATIONS.DISABLE(id)}`);
  },

  desertion(id) {
    return api.put(`${BASE}${API_ENDPOINTS.REGISTRATIONS.DESERTION(id)}`);
  },

  graduated(id) {
    return api.put(`${BASE}${API_ENDPOINTS.REGISTRATIONS.GRADUATED(id)}`);
  },

  // Retirar estudiante por ID de estudiante
  withdrawStudent(studentId) {
    return api.put(`${BASE}/${studentId}/withdraw`);
  },

  // Eliminar matrícula
  delete(id) {
    return api.delete(`${BASE}${API_ENDPOINTS.REGISTRATIONS.DELETE(id)}`);
  },

  // ============ MÉTODOS PARA ACUDIENTES ============
  
  // Obtener acudiente por ID
  getAttendantById(attendantId) {
    return api.get(`${BASE}/attendant/${attendantId}/registration`);
  },

  // Crear acudiente
  createAttendant(data) {
    return api.post(`${BASE}/attendant/registration`, data);
  },

  // Actualizar acudiente
  updateAttendant(attendantId, data) {
    return api.put(`${BASE}/attendant/${attendantId}/registration`, data);
  },

  // Activar acudiente
  activateAttendant(attendantId) {
    return api.put(`${BASE}/attendant/${attendantId}/activate/registration`);
  },

  // Desactivar acudiente
  desactivateAttendant(attendantId) {
    return api.put(`${BASE}/attendant/${attendantId}/desactivate/registration`);
  },

  // Eliminar acudiente
  deleteAttendant(attendantId) {
    return api.delete(`${BASE}/attendant/${attendantId}/registration`);
  }
};