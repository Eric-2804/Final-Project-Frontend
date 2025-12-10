import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-final-ptwh.onrender.com',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      'API Error:',
      JSON.stringify(err.response?.data, null, 2) || err.message
    );
    return Promise.reject(err);
  }
);

export default api;
