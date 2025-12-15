import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-final-ptwh.onrender.com',
  timeout: 70000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers['x-token'] = token;
    console.log('🔑 Token enviado en header x-token:');
  } else {
    console.warn('⚠️ No hay token para enviar');
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const errorMsg = err.response?.data?.msg || err.response?.data?.message || '';
    
    console.error('❌ API Error:');
    console.error('  Status:', status);
    console.error('  Message:', errorMsg);
    console.error('  Data:', err.response?.data);
    
    // Manejar error 401 (token expirado o inválido)
    if (status === 401) {
      console.warn('⚠️ Error 401 detectado');
      
      // Mensajes específicos del backend que indican problemas con el token
      const tokenErrors = [
        'No hay token en la peticion',
        'token no valido',
        'usuario no existe',
        'El usuario no esta activo'
      ];
      
      const isTokenError = tokenErrors.some(msg => errorMsg.includes(msg));
      
      if (isTokenError) {
        console.warn('🚨 Error de autenticación de token. Limpiando sesión...');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir al login solo si no estamos ya en login
        const isLoginPage = window.location.pathname === '/' || window.location.pathname === '/login';
        if (!isLoginPage) {
          console.log('➡️ Redirigiendo al login...');
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        }
      }
    }
    
    return Promise.reject(err);
  }
);

export default api;
