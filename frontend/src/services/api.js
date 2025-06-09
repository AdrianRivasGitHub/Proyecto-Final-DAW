import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API = axios.create({
  baseURL: apiBaseUrl,
  // headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (
      token &&
      !config.url.includes('/auth/login') &&
      !config.url.includes('/auth/registro')
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores globales
    // Se puede redirigir al login o limpiar el token.
    // console.error('Error en la respuesta de la API:', error);
    return Promise.reject(error); // Rechazar el error para que pueda ser capturado localmente también
  }
);

export default API;