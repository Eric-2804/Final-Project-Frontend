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
    BASE: '/headquarters',
    BY_COLEGIO: (id) => `/colegios/${id}/headquarters`,
    ACTIVATE: (id) => `/headquarters/${id}/activo`,
    DEACTIVATE: (id) => `/headquarters/${id}/desactiva`,
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
};