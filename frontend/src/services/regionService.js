import API from './api'; // Importa la instancia central de Axios

const RUTA_REGIONES = '/regiones';

export const getRegiones = () => API.get(RUTA_REGIONES);

export default {
    getRegiones
};