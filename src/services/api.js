import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-final-ptwh.onrender.com/',
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['x-token'] = token; 
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
