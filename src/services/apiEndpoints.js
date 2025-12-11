export const API_ENDPOINTS = {
  REGISTRATIONS: {
    BASE: '/api/matriculas',
    CREATE: '/',	// Crear 
    GET_BY_YEAR: (year) => `/year/${year}`,  // Obtener matriculas por año
    GET_BY_ID: (id) => `/${id}`, // Obtener por ID
    GET_BY_GROUP: (groupsId) => `/groups/${groupsId}/registrations`,	// Obtener matriculas por grupo
    GET_BY_STUDENT: (studentId) => `/student/${studentId}/registrations`,	// Obtener matriculas por estudiante
    UPDATE: (id) => `/${id}`, // Actualizar 
    ACTIVATE: (id) => `/${id}/activate`, // Activar 
    DISABLE: (id) => `/${id}/desactivate`, // Desactivar 
    DESERTION: (id) => `/${id}/desertion`, // Retirar estudiante 
    GRADUATED: (id) => `/${id}/graduated`, // Actualizar estado de estudiante como graduado 
    DELETE: (id) => `/${id}`, // Eliminar
  },
  ATTENDANT: { // Acudiente
    BASE: '/api/acudiente',
    CREATE: '/matriculas',                      // POST /api/acudiente/matriculas  - Crear acudiente
    UPDATE: (id) => `/${id}/matriculas`,        // PUT  /api/:acudienteId/matriculas  - Actualizar acudiente
    ACTIVATE: (id) => `/${id}/activar/matriculas`,   // PUT  /api/:acudienteId/activar/matriculas  - Activar acudiente
    DISABLE: (id) => `/${id}/desactivar/matriculas`, // PUT  /api/:acudienteId/desactivar/matriculas  - Desactivar acudiente
    DELETE: (id) => `/${id}/matriculas`,        // DELETE /api/:acudienteId/matriculas   - Eliminar acudiente
  },
  PARAMETERS: {
    BASE: '/api/parameters',
    CREATE: '/',	// Crear nuevo parámetro
    GET_ALL: '/', // Listar todos los parámetros
    GET_BY_ID: (id) => `/${id}`, // Obtener parametro por ID
    GET_BY_SCHOOL: (colegio) => `/colegio/${colegio}`,	// Obtener parámetros por colegio
    UPDATE: (id) => `/${id}`, // Actualizar 
    ACTIVATE: (id) => `/${id}/activate`, // Activar 
    DISABLE: (id) => `/${id}/deactivate`, // Desactivar 
    DELETE: (id) => `/${id}`, // Eliminar
  },
  INDICATORS: {
    BASE: '/api/indicators',
    CREATE: '/',	// Crear nuevo indicador
    GET_ALL: '/', // Listar todos los indicadores
    GET_BY_ID: (id) => `/${id}`,	// Obtener indicador por ID
    GET_BY_ACADEMICLOADS: (id) => `/academicloads/${id}/indicators`, // Obtener indicadores por carga académica
    GET_BY_YEAR: (year) => `/years/${year}`,  // Obtener indicadores por año
    GET_BY_PERIOD: (id) => `/periods/${id}/indicators`, // Obtener indicadores por período
    GET_BY_USER: (id) => `/modelusers/${id}/indicators`, // Obtener indicadores por usuario
    UPDATE: (id) => `/${id}`, // Actualizar 
    ACTIVATE: (id) => `/${id}/activate`, // Activar 
    DISABLE: (id) => `/${id}/deactive`, // Desactivar 
    DELETE: (id) => `/${id}`, // Eliminar
  },
  QUALIFICATIONS: { // ampliado según documento
    BASE: '/api/qualifications',
    GET_BY_ID: (id) => `/${id}`, // GET /api/qualifications/:id - Obtener calificación por ID
    GET_BY_STUDENT: (studentId) => `/estudiantes/${studentId}/calificaciones`, // GET /api/qualifications/estudiantes/:studentId/calificaciones
    GET_BY_GROUP: (groupId) => `/grupos/${groupId}/calificaciones`,           // GET /api/qualifications/grupos/:groupId/calificaciones
    GET_BY_GROUP_AND_SUBJECT: (groupId, subjectId) => `/grupos/${groupId}/materias/${subjectId}/calificaciones`, // GET /api/qualifications/grupos/:groupId/materias/:subjectId/calificaciones
    GET_FINALS_BY_YEAR: (year) => `/finales/${year}`,                         // GET /api/qualifications/finales/:year
    GET_FINALS_BY_STUDENT: (studentId) => `/estudiantes/${studentId}/calificaciones/finales`, // GET /api/qualifications/estudiantes/:studentId/calificaciones/finales
    GET_FINALS_BY_GROUP: (groupId) => `/grupos/${groupId}/calificaciones/finales`,            // GET /api/qualifications/grupos/:groupId/calificaciones/finales
    CREATE: '/',                 // POST /api/qualifications/ - Crear calificación individual
    CREATE_BATCH: '/lote',       // POST /api/qualifications/lote - Crear múltiples calificaciones (lote)
    GENERATE_FINALS: '/generar-finales', // POST /api/qualifications/generar-finales - Generar notas finales automáticamente
    UPDATE: (id) => `/${id}`,                     // PUT /api/qualifications/:id - Actualizar calificación de período
    UPDATE_FINAL: (id) => `/finales/${id}`,       // PUT /api/qualifications/finales/:id - Actualizar calificación final
    DELETE: (id) => `/${id}`,                     // DELETE /api/qualifications/:id
  },
  SUBJECTS: {
    BASE: '/api/subjects',
    CREATE: '/', // Crear nueva materia
    GET_ALL: '/', // Listar todas las materias
    GET_BY_ID: (id) => `/${id}`, // Obtener materia por ID
    GET_BY_TYPE: (type) => `/type/${type}`,	// Listar materias por tipo
    GET_BY_AREA: (area) => `/area/${area}`,	// Listar materias por área
    UPDATE: (id) => `/${id}`, // Actualizar materia
    ACTIVATE: (id) => `/${id}/activate`, // Activar materia
    DISABLE: (id) => `/${id}/desactivate`, // Desactivar materia
    DELETE: (id) => `/${id}`, // Eliminar
  },
  GROUPS: {
    BASE: '/api/groups',
    CREATE: '/', // Crear grupos
    GET_ALL_BY_YEAR: (year) => `/year/${year}`,  // Obtener todos por año
    GET_BY_ID: (id) => `/${id}`, // Obtener por ID
    GET_GUARDIAN_BY_GROUP: (id) => `/${id}/acudientes`, // Listar los acudientes por grupo
    GET_GROUP_BY_HEADQUARTERS: (sedeId) => `/sedes/${sedeId}/grupos`, // Grupos por sede. 
    GET_STUDENT_BY_GROUP: (id) => `/${id}/estudiantes`,  // Estudiantes por grupo
    UPDATE: (id) => `/${id}`, // Actualizar
    ACTIVATE: (id) => `/${id}/activar`, // Activar
    DISABLE: (id) => `/${id}/desactivar`, // Desactivar
    DELETE: (id) => `/${id}`, // Eliminar
  },
  ACADEMIC_LOAD: { // Carga académica (AcademicLoad)
    BASE: '/api/AcademicLoad',
    GET_BY_YEAR: (year) => `/year/${year}`,                       // GET /api/AcademicLoad/year/:year
    GET_BY_ID: (id) => `/${id}`,                                  // GET /api/AcademicLoad/:id
    GET_BY_PROFESSOR: (professorId) => `/professor/${professorId}`, // GET /api/AcademicLoad/professor/:professorId
    GET_BY_GROUP: (groupId) => `/group/${groupId}`,               // GET /api/AcademicLoad/group/:groupId
    CREATE: '/',                                                   // POST /api/AcademicLoad/ - Crear nueva carga académica
    UPDATE: (id) => `/${id}`,                                      // PUT /api/AcademicLoad/:id - Actualizar
    ACTIVATE: (id) => `/${id}/activate`,                           // PUT /api/AcademicLoad/:id/activate
    DEACTIVATE: (id) => `/${id}/deactivate`,                       // PUT /api/AcademicLoad/:id/deactivate
    DELETE: (id) => `/${id}`,                                      // DELETE /api/AcademicLoad/:id
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
  HEADQUARTERS: {
    BASE: '/api/headquarters',
    CREATE: () => '/', // Crear sedes
    GET_ALL: '/',  // Listar todas las sedes
    GET_BY_ID: (id) => `/${id}`, // Obtener por ID
    BY_COLEGIO: (id) => `/school/${id}/headquarters`, // Obtener sedes por colegio
    UPDATE: (id) => `/${id}`,  // Actualizar sede
    ACTIVATE: (id) => `/${id}/activate`,  // Activar sede
    DISABLE: (id) => `/${id}/desactivate`,  // Desactivar sede
    DELETE: (id) => `/${id}`, // Eliminar sede
  },
  VALIDITIES: {
    BASE: '/api/validity',
    CREATE: () => '/', // Crear nueva vigencia
    GET_ALL_BY_YEAR: (year) => `/${year}`,  // Listar vigencias por año
    GET_ACTIVE: (isActive) => `/${isActive}`, // Obtener vigencia activa
    ACTIVATE: (id) => `/${id}/activar`, // Activar vigencia
    DISABLE: (id) => `/${id}/desactivar`, // Desactivar vigencia
  },
  PERIODS: {
    BASE: '/api/periods',
    CREATE: '/', // Crear nuevo período
    GET_ALL: '/', // Listar todos los períodos
    GET_BY_ID: (id) => `/${id}`, // Obtener por ID
    BY_YEAR: (year) => `/year/${year}`, // Obtener períodos por año
    UPDATE: (id) => `/${id}`,  // Actualizar periodo
    ACTIVATE: (id) => `/${id}/activate`, // Activar período
    DISABLE: (id) => `/${id}/deactivate`, // Desactivar período
    DELETE: (id) => `/${id}`, // Eliminar periodos
  },

  REPORTS: { // Reportes y consultas especiales
    BASE: '/api/reportes',
    GROUP_STATS: (grupoId) => `/estadisticas-grupo/${grupoId}`, // GET /api/reportes/estadisticas-grupo/:grupoId
    // Boletines corto/largo por estudiante y por grupo (por periodo y año)
    BOLETIN_CORTO_ESTUDIANTE: (estudianteId, periodoId, año) => `/boletin-corto/${estudianteId}/${periodoId}/${año}`, // GET /api/reportes/boletin-corto/:estudianteId/:periodoId/:año
    BOLETIN_LARGO_ESTUDIANTE: (estudianteId, periodoId, año) => `/boletin-largo/${estudianteId}/${periodoId}/${año}`,  // GET /api/reportes/boletin-largo/:estudianteId/:periodoId/:año
    BOLETIN_CORTO_GRUPO: (grupoId, periodoId, año) => `/boletin-corto/${grupoId}/${periodoId}/${año}`, // GET /api/reportes/boletin-corto/:grupoId/:periodoId/:año
    BOLETIN_LARGO_GRUPO: (grupoId, periodoId, año) => `/boletin-largo/${grupoId}/${periodoId}/${año}`,  // GET /api/reportes/boletin-largo/:grupoId/:periodoId/:año
    // Boletines finales con notas finales
    BOLETIN_FINAL_CORTO_ESTUDIANTE: (estudianteId, año) => `/boletin-final-corto/${estudianteId}/${año}`, // GET /api/reportes/boletin-final-corto/:estudianteId/:año
    BOLETIN_FINAL_LARGO_ESTUDIANTE: (estudianteId, año) => `/boletin-final-largo/${estudianteId}/${año}`,  // GET /api/reportes/boletin-final-largo/:estudianteId/:año
    BOLETIN_FINAL_CORTO_GRUPO: (grupoId, año) => `/boletin-final-corto/${grupoId}/${año}`, // GET /api/reportes/boletin-final-corto/:grupoId/:año
    BOLETIN_FINAL_LARGO_GRUPO: (grupoId, año) => `/boletin-final-largo/${grupoId}/${año}`,  // GET /api/reportes/boletin-final-largo/:grupoId/:año
    // Consolidados y estadísticas
    CONSOLIDADO_MATERIA: (materiaId, periodoId) => `/consolidado-materia/${materiaId}/${periodoId}`, // GET /api/reportes/consolidado-materia/:materiaId/:periodoId
    CONSOLIDADO_GRUPO: (grupoId, periodoId, año) => `/consolidado-grupo/${grupoId}/${periodoId}/${año}`, // GET /api/reportes/consolidado-grupo/:grupoId/:periodoId/:año
    STATISTICS_YEAR: (año) => `/estadisticas-año/${año}`, // GET /api/reportes/estadisticas-año/:año (modo gráfica)
    CERTIFICATE_NOTAS: (estudianteId, grupoId, año) => `/certificado-notas/${estudianteId}/${grupoId}/${año}`, // GET /api/reportes/certificado-notas/:estudianteId/:grupoId/:año
    CUADRO_HONOR: (añoColegio, periodoId) => `/cuadro-honor/${añoColegio}/${periodoId}`, // GET /api/reportes/cuadro-honor/:añoColegio/:periodoId
    LIST_STUDENTS: (añoColegio, colegioId, grupoId) => `/listar-estudiantes/${añoColegio}/${colegioId}/${grupoId}`, // GET /api/reportes/listar-estudiantes/:añoColegio/:colegioId/:grupoId
  },
};
