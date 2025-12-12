import api from "./api.js";

export default {
  // Obtener matrículas por año
  getAllByYear(year) {
    return api.get(`/registration/year/${year}`);
  },

  // Obtener una matrícula por ID
  getById(id) {
    return api.get(`/registration/${id}`);
  },

  // Obtener matrículas por acudiente
  getByAttendant(attendantId) {
    return api.get(`/registration/students-by-attendant/${attendantId}`);
  },

  // Crear matrícula
  create(data) {
    return api.post(`/registration`, data);
  },

  // Actualizar matrícula
  update(id, data) {
    return api.put(`/registration/${id}`, data);
  },

  // Cambios de estado
  activate(id) {
    return api.put(`/registration/${id}/activate`);
  },

  desactivate(id) {
    return api.put(`/registration/${id}/desactivate`);
  },

  desertion(id) {
    return api.put(`/registration/${id}/desertion`);
  },

  graduated(id) {
    return api.put(`/registration/${id}/graduated`);
  }
};