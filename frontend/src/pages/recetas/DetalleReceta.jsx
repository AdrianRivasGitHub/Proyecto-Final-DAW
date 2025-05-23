import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recetasService from '../../services/recetasService';

const DetalleReceta = () => {
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarReceta();
  }, []);

  const cargarReceta = async () => {
    try {
      const data = await recetasService.obtenerPorId(id);
      setReceta(data);
    } catch (error) {
      console.error('Error al cargar receta:', error);
    }
  };

  if (!receta) return <p className="p-4">Cargando receta...</p>;

  return (
    <div className="p-4">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-2">{receta.nombre}</h1>
      <p className="text-gray-700 mb-2">Subcategoría: {receta.subcategoria?.nombre || 'N/A'}</p>
      <p className="text-gray-700 mb-2">Descripción: {receta.descripcion}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Ingredientes:</h2>
      <ul className="list-disc list-inside">
        {receta.ingredientes?.map((ing, index) => (
          <li key={index}>{ing.nombre} - {ing.cantidad}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">Preparación:</h2>
      <p className="text-gray-800 whitespace-pre-wrap">{receta.instrucciones}</p>
    </div>
  );
};

export default DetalleReceta;
