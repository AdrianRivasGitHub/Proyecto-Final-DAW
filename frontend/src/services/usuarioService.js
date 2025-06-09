import API from './api'; // Importa la instancia central de Axios

const RUTA_USUARIOS = '/usuarios/';

export const getUsuarios = () => API.get(RUTA_USUARIOS);

export const createUsuario = (data) => API.post(RUTA_USUARIOS, data);

export const getUsuarioById = (id) => API.get(`${RUTA_USUARIOS}${id}`);

export const updateUsuario = (id, data) => API.put(`${RUTA_USUARIOS}${id}`, data);

export const deleteUsuario = (id) => API.delete(`${RUTA_USUARIOS}${id}`);

export default {
    getUsuarios,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
};