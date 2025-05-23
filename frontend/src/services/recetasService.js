import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recetas';

const obtenerTodas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const obtenerPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export default {
  obtenerTodas,
  obtenerPorId
};
