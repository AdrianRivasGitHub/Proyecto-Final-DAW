import API from './api'; // Importa la instancia central de Axios

const RUTA_SUBCATEGORIAS = '/subcategorias';

export const getSubcategorias = () => API.get(RUTA_SUBCATEGORIAS);

export const createSubcategoria = (data) => API.post(`${RUTA_SUBCATEGORIAS}/`, data);

export const getSubcategoriaById = (id) => API.get(`${RUTA_SUBCATEGORIAS}/${id}`);

export const updateSubcategoria = (id, data) => API.put(`${RUTA_SUBCATEGORIAS}/${id}`, data);

export const deleteSubcategoria = (id) => API.delete(`${RUTA_SUBCATEGORIAS}/${id}`);

export default {
    getSubcategorias,
    createSubcategoria,
    getSubcategoriaById,
    updateSubcategoria,
    deleteSubcategoria,
};