import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getPlanificaciones = () => axios.get(`${API_URL}/planificaciones`);
export const createPlanificacion = (data) => axios.post(`${API_URL}/planificaciones`, data);
export const getRecetas = () => axios.get(`${API_URL}/recetas`);

export default API;