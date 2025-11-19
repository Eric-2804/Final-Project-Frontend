import api from "../api.js";

export default {
  // Obtener matrículas por año
  getAllByYear(year) {
    return api.get(`/api/registration/year/${year}`);
  },

  // Obtener una matrícula por ID
  getById(id) {
    return api.get(`/api/registration/${id}`);
  },

  // Crear matrícula
  create(data) {
    return api.post(`/api/registration`, data);
  },

  // Actualizar matrícula
  update(id, data) {
    return api.put(`/api/registration/${id}`, data);
  },

  // Cambios de estado
  activate(id) {
    return api.put(`/api/registration/${id}/activate`);
  },

  desactivate(id) {
    return api.put(`/api/registration/${id}/desactivate`);
  },

  desertion(id) {
    return api.put(`/api/registration/${id}/desertion`);
  },

  graduated(id) {
    return api.put(`/api/registration/${id}/graduated`);
  }
};
