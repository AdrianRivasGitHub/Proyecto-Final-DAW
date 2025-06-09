import API from './api'; // Importa la instancia central de Axios

const RUTA_FAVORITOS = '/favoritos/';

export const agregarFavorito = (data) => API.post(RUTA_FAVORITOS, data);

export const obtenerFavoritos = (id) => API.get(`${RUTA_FAVORITOS}usuario/${id}`);

export const eliminarFavorito = (id) => API.delete(`${RUTA_FAVORITOS}${id}`);

export default {
    agregarFavorito,
    obtenerFavoritos,
    eliminarFavorito,
};