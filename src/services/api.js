import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-final-ptwh.onrender.com',
  timeout: 70000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-token'] = token;
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
