import API from './api'; // Importa la instancia central de Axios

const AUTH_API  = '/auth/';

export const login = (credentials) => API.post(`${AUTH_API}login`, credentials);

export const registro = (credentials) => API.post(`${AUTH_API}registro`, credentials);

export default {
    login,
    registro
};