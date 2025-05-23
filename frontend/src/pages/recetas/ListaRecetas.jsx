import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recetasService from '../../services/recetasService';
import API from '../../services/api';

const ListaRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      const data = await recetasService.obtenerTodas();
      setRecetas(data);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    }
  };

  const recetasFiltradas = recetas.filter(receta =>
    receta.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Listado de Recetas</h1>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recetasFiltradas.map((receta) => (
          <div
            key={receta.id}
            className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/recetas/${receta.id_receta}`)}
          >
            <h2 className="text-xl font-semibold">{receta.nombre}</h2>
            <p className="text-gray-600">Subcategoría: {receta.subcategoria?.nombre || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaRecetas;
