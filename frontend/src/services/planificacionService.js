import API from './api'; // Importa la instancia central de Axios

const RUTA_PLANIFICACIONES = '/planificaciones';

export const getPlanificaciones = () => API.get(RUTA_PLANIFICACIONES);

export const createPlanificacion = (data) => API.post(`${RUTA_PLANIFICACIONES}/`, data);

export const getPlanificacionById = (id) => API.get(`${RUTA_PLANIFICACIONES}/${id}`);

export const updatePlanificacion = (id, data) => API.put(`${RUTA_PLANIFICACIONES}/${id}`, data);

export const deletePlanificacion = (id) => API.delete(`${RUTA_PLANIFICACIONES}/${id}`);

export default {
    getPlanificaciones, 
    createPlanificacion, 
    getPlanificacionById, 
    updatePlanificacion, 
    deletePlanificacion
};
