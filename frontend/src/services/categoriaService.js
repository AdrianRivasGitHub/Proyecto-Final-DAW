import API from './api'; // Importa la instancia central de Axios

const RUTA_CATEGORIAS = '/categorias/';

export const getCategorias = () => API.get(RUTA_CATEGORIAS);

export default {
    getCategorias
};