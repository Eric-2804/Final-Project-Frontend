import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-final-ptwh.onrender.com',
  timeout: 70000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

  if (token) {
    config.headers['x-token'] = token;
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const errorMsg = err.response?.data?.msg || err.response?.data?.message || '';
    
    // Manejar error 401 (token expirado o inválido)
    if (status === 401) {
      
      // Mensajes específicos del backend que indican problemas con el token
      const tokenErrors = [
        'No hay token en la peticion',
        'token no valido',
        'usuario no existe',
        'El usuario no esta activo'
      ];
      
      const isTokenError = tokenErrors.some(msg => errorMsg.includes(msg));
      
      if (isTokenError) {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir al login solo si no estamos ya en login
        const isLoginPage = window.location.pathname === '/' || window.location.pathname === '/login';
        if (!isLoginPage) {
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE INTERCEPTOR SEGURO
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const data = err.response?.data;

    console.error('❌ API Error:', status, data);

    // ⛔ NO redirigir automáticamente por 401
    // Solo mostrar error y dejar que la vista decida
    if (status === 401) {
      console.warn('⚠️ 401 recibido, pero NO se cerrará sesión automáticamente');
    }

    return Promise.reject(err);
  }
);

export default api;
