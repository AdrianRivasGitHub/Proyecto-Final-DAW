import API from './api'; // Importa la instancia central de Axios

const RUTA_INGREDIENTES = '/ingredientes';

export const getIngredientes = () => API.get(RUTA_INGREDIENTES);

export const createIngrediente = (data) => API.post(`${RUTA_INGREDIENTES}/`, data);

export const getIngredienteById = (id) => API.get(`${RUTA_INGREDIENTES}/${id}`);

export const updateIngrediente = (id, data) => API.put(`${RUTA_INGREDIENTES}/${id}`, data);

export const deleteIngrediente = (id) => API.delete(`${RUTA_INGREDIENTES}/${id}`);

export default {
    getIngredientes,
    createIngrediente,
    getIngredienteById,
    updateIngrediente,
    deleteIngrediente
};
