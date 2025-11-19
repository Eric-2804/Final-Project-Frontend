import api from "../api.js";

export default {
  // Grupos por año
  getByYear(year) {
    return api.get(`/grupos/year/${year}`);
  },

  // Estudiantes por grupo
  getStudents(groupId) {
    return api.get(`/grupos/${groupId}/estudiantes`);
  }
};
