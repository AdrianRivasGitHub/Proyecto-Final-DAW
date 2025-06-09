import API from './api'; // Importa la instancia central de Axios

const RUTA_ALERGENOS = '/alergenos/';

export const getAlergenos = () => API.get(RUTA_ALERGENOS);

export default {
    getAlergenos
};