import API from './api'; // Importa la instancia central de Axios

const RUTA_RECETAS = '/recetas';

export const getRecetas = () => API.get(RUTA_RECETAS);

export const createReceta = (data) => 
    API.post(`${RUTA_RECETAS}/`, data);

export const getRecetaById = (id) => API.get(`${RUTA_RECETAS}/${id}`);

export const updateReceta = (id, data) => 
    API.put(`${RUTA_RECETAS}/${id}`, data);

export const deleteReceta = (id) => API.delete(`${RUTA_RECETAS}/${id}`);

export default {
    getRecetas,
    getRecetaById,
    createReceta, 
    updateReceta,
    deleteReceta,
};
