import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-final-ptwh.onrender.com',
  timeout: 70000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['x-token'] = token;
    console.log('🔑 Token enviado en header x-token:', token.substring(0, 30) + '...');
  } else {
    console.warn('⚠️ No hay token para enviar');
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
