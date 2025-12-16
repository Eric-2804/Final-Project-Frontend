import { getData, postData, putData, deleteData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

const { HEADQUARTERS } = API_ENDPOINTS;

// Obtener todas las sedes
export const getAllSedes = () => {
  return getData(`${HEADQUARTERS.BASE}${HEADQUARTERS.GET_ALL()}`);
};

// Obtener sede por ID
export const getSedeById = (id) => {
  return getData(`${HEADQUARTERS.BASE}${HEADQUARTERS.GET_BY_ID(id)}`);
};

// Obtener sedes por colegio
export const getSedesByColegio = (colegioId) => {
  return getData(`${HEADQUARTERS.BASE}${HEADQUARTERS.BY_COLEGIO(colegioId)}`);
};

// Crear sede
export const createSede = (data) => {
  return postData(`${HEADQUARTERS.BASE}${HEADQUARTERS.CREATE()}`, data);
};

// Actualizar sede
export const updateSede = (id, data) => {
  return putData(`${HEADQUARTERS.BASE}${HEADQUARTERS.UPDATE(id)}`, data);
};

// Activar sede
export const activateSede = (id) => {
  return putData(`${HEADQUARTERS.BASE}${HEADQUARTERS.ACTIVATE(id)}`);
};

// Desactivar sede
export const deactivateSede = (id) => {
  return putData(`${HEADQUARTERS.BASE}${HEADQUARTERS.DISABLE(id)}`);
};

// Eliminar sede
export const deleteSede = (id) => {
  return deleteData(`${HEADQUARTERS.BASE}${HEADQUARTERS.DELETE(id)}`);
};
