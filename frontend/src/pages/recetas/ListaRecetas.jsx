import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recetasService from '../../services/recetaService';
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

const ListaRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar el mensaje de error
      const response = await recetasService.getRecetas();
      console.log('Respuesta de la API:', response.data);
      setRecetas(response.data);
    } catch (err) {
      console.error('Error al cargar recetas:', err);
      setError('No se pudieron cargar las recetas. Inténtalo de nuevo más tarde.');
    }
    setLoading(false);
  };

  const recetasFiltradas = recetas.filter(receta =>
    receta.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Listado de Recetas</h1>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-sm"
      />

        {loading && <p className="text-center text-orange-600">Cargando recetas...</p>}
        {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

        {!loading && !error && recetasFiltradas.length === 0 && (
          <p className="text-center text-gray-500">
            {filtro ? 'No se encontraron recetas con ese nombre.' : 'No hay recetas disponibles en este momento.'}
          </p>
        )}

        {!loading && !error && recetasFiltradas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recetasFiltradas.map((receta) => (
              <div
                key={receta.id_receta}
                className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(`/recetas/${receta.id_receta}`)}
              >
                <div>
                  <h2 className="text-xl font-semibold text-orange-700 mb-2">{receta.nombre}</h2>
                  {/* <img src={receta.imagen_url || 'default-image.jpg'} alt={receta.nombre} className="w-full h-40 object-cover rounded-md mb-3" /> */}
                  <p className="text-gray-600 text-sm mb-1">Categoría: {receta.categoria?.nombre || 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Región: {receta.region?.nombre || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      <Footer />
    </div>
  );
};

export default ListaRecetas;
