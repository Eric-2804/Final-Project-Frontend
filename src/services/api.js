import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-final-ptwh.onrender.com',
  timeout: 70000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers['x-token'] = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.error('❌ API Error:', status, data);

    // 🔐 Manejo controlado de 401
    if (status === 401) {
      const errorMsg = data?.msg || data?.message || '';
      const tokenErrors = [
        'No hay token en la peticion',
        'token no valido',
        'usuario no existe',
        'El usuario no esta activo'
      ];

      if (tokenErrors.some(msg => errorMsg.includes(msg))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const isLoginPage =
          window.location.pathname === '/' ||
          window.location.pathname === '/login';

        if (!isLoginPage) {
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
