import api from "../api.js";

export default {
  // Obtener todas las cargas académicas
  getAll() {
    return api.get("/academicload");
  },

  // Obtener una carga por ID
  getById(id) {
    return api.get(`/academicload/${id}`);
  },

  // Crear nueva carga académica
  create(data) {
    return api.post("/academicload", data);
  },

  // Actualizar carga existente
  update(id, data) {
    return api.put(`/academicload/${id}`, data);
  },

  // Eliminar carga
  delete(id) {
    return api.delete(`/academicload/${id}`);
  },

  // Filtros
  getByInstructor(instructorId) {
    return api.get(`/academicload/instructor/${instructorId}`);
  },

  getByFicha(ficha) {
    return api.get(`/academicload/ficha/${ficha}`);
  },

  getByTrimestre(trimestre) {
    return api.get(`/academicload/trimestre/${trimestre}`);
  },

  getByJornada(jornada) {
    return api.get(`/academicload/jornada/${jornada}`);
  },

  getByPrograma(programa) {
    return api.get(`/academicload/programa/${programa}`);
  }
};