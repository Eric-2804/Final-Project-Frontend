import api from "../api.js";

export default {
  // Grupos por año
  getByYear(year) {
    return api.get(`/api/grupos/year/${year}`);
  },

  // Estudiantes por grupo
  getStudents(groupId) {
    return api.get(`/api/grupos/${groupId}/estudiantes`);
  }
};
