import API from './api'; // Importa la instancia central de Axios

const RUTA_RECETAS = '/recetas/'; // Asegurar la barra al final

export const getRecetas = () => API.get(RUTA_RECETAS);

export const createReceta = (data) => 
    API.post(RUTA_RECETAS, data); // RUTA_RECETAS ya tiene la barra

export const getRecetaById = (id) => API.get(`${RUTA_RECETAS}${id}`);

export const getRecetasByCategoria = (categoriaId) => 
    API.get(`${RUTA_RECETAS}categoria/${categoriaId}`);

export const getRecetasByRegion = (regionId) => 
    API.get(`${RUTA_RECETAS}region/${regionId}`);

export const updateReceta = (id, data) => 
    API.put(`${RUTA_RECETAS}${id}`, data);

export const deleteReceta = (id) => API.delete(`${RUTA_RECETAS}${id}`);

export default {
    getRecetas,
    getRecetaById,
    getRecetasByCategoria,
    getRecetasByRegion,
    createReceta, 
    updateReceta,
    deleteReceta,
};
