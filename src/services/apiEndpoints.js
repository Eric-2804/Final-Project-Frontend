export const API_ENDPOINTS = {
  MATRICULAS: {
    BASE: '/registration'
  },
  PARAMETROS: {
    BASE: '/parametros'
  },
  INDICADORES: {
    BASE: '/indicadores'
  },
  CALIFICACIONES: {
    BASE: '/calificaciones'
  },
    CARGA_ACADEMICA: {
    BASE: '/carga-academica'
  },
  NOTIFICATIONS: {
    BASE: '/notifications'
  },
  MATERIAS_AREAS: {
    BASE: '/subjects'
  },
  GRUPOS: {
    BASE: '/groups'
  },
  USUARIOS_COLEGIO: {
    BASE: 'api/users',
    DELETE: '/usuarios-colegio/delete'
  },

  AUTH: {
    LOGIN: 'api/users',
    RENEW_TOKEN: '/usuarios-colegio/renovar-token',
    LOGOUT: '/usuarios-colegio/logout',
    RECOVER_PASSWORD: '/usuarios-colegio/recuperar-contraseña',
    RESET_PASSWORD: '/usuarios-colegio/restablecer-contraseña',
  },
  DIRECCION_NUCLEO: {
    BASE: '/direcciones-nucleo',
    LOGIN: '/direcciones-nucleo/login',
    CHANGE_PASSWORD: (id) => `/direcciones-nucleo/${id}/cambiar-password`,
  },
  COLEGIOS: {
    BASE: '/schools',
    BY_DIRECCION_NUCLEO: (id) => `/direcciones-nucleo/${id}/colegios`,
  },
 SEDES: {
    BASE: '/api/headquarters', 
    UPDATE: (id) => `/api/headquarters/${id}`,
    BY_COLEGIO: (id) => `/api/headquarters/colegios/${id}/sedes`,
    ACTIVATE: (id) => `/api/headquarters/${id}/activar`,
    DEACTIVATE: (id) => `/api/headquarters/${id}/inactivar`,
  },
  VIGENCIAS: {
    BY_YEAR: '/vigencias/año',
    ACTIVE: '/vigencias/activa',
    BASE: '/vigencias',
    ACTIVATE: (id) => `/vigencias/${id}/activar`,
    DEACTIVATE: (id) => `/vigencias/${id}/desactivar`,
  },
  PERIODOS: {
    BASE: '/periodos',
    BY_YEAR: (year) => `/periodos/año/${year}`,
    ACTIVATE: (id) => `/periodos/${id}/activar`,
    DEACTIVATE: (id) => `/periodos/${id}/desactivar`,
  },
  USERS: {
    BASE: '/api/users',
    GET_BY_ID: (id) => `/api/users/${id}`,
    GET_BY_ROL: (rol) => `/api/users/rol/${rol}`,
    CHANGE_PASSWORD: (id) => `/api/users/${id}/change-password`,
    REFRESH_TOKEN: '/api/users/refreshToken',
    ACTIVATE: (id) => `/api/users/${id}/activate`,
    DESACTIVATE: (id) => `/api/users/${id}/desactivate`,
    UPDATE_PASSWORD: '/api/users/passwordRecovered',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`
  }
  
  
};