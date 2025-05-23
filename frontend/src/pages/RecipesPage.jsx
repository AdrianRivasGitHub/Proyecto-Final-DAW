import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecipesPage() {
  const [recetas, setRecetas] = useState([]);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/recetas';

  // Función para cargar la lista de recetas
  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        const response = await axios.get(API_URL);
        setRecetas(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar las recetas:', err);
        setError('Error al cargar las recetas.');
        setLoading(false);
      }
    };

    cargarRecetas();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para mostrar el detalle de una receta
  const mostrarDetalleReceta = (receta) => {
    setSelectedReceta(receta);
  };

  if (loading) {
    return <div className="container mt-5"><p>Cargando recetas...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Recetas</h1>
      <div className="row">
        <div className="col-md-4">
          <h3>Lista de Recetas</h3>
          <ul id="lista-recetas" className="list-group">
            {recetas.length === 0 ? (
              <li className="list-group-item">No hay recetas disponibles.</li>
            ) : (
              recetas.map(receta => (
                <li
                  key={receta.id_receta} // Es crucial para las listas en React
                  className={`list-group-item ${selectedReceta?.id_receta === receta.id_receta ? 'active' : ''}`}
                  onClick={() => mostrarDetalleReceta(receta)}
                  style={{ cursor: 'pointer' }} // Indica que es clickeable
                >
                  {receta.nombre}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="col-md-8">
          <h3>Detalle de la Receta</h3>
          <div id="detalle-receta" className="card">
            {selectedReceta ? (
              <div className="card-body">
                <h5 className="card-title">{selectedReceta.nombre}</h5>
                <p className="card-text">{selectedReceta.descripcion || 'Sin descripción disponible.'}</p>
                {/* Nota: Tu backend debe incluir categoria, region, ingredientes, preparacion en la respuesta de /api/recetas */}
                <p><strong>Categoría:</strong> {selectedReceta.categoria?.nombre || 'No especificada.'}</p>
                <p><strong>Región:</strong> {selectedReceta.region?.nombre || 'No especificada.'}</p>
                {/* Asumiendo que ingredientes y preparacion vienen como strings o arrays que puedes mostrar */}
                <p><strong>Ingredientes:</strong> {selectedReceta.ingredientes || 'No especificados.'}</p>
                <p><strong>Instrucciones:</strong> {selectedReceta.preparacion || 'No especificadas.'}</p>
                {/* Si imagen_url viene en el objeto de receta */}
                {selectedReceta.imagen_url && (
                    <img src={selectedReceta.imagen_url} className="card-img-top" alt={selectedReceta.nombre} style={{ maxWidth: '100%', height: 'auto' }} />
                )}
              </div>
            ) : (
              <div className="card-body">
                <p>Selecciona una receta de la lista para ver los detalles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipesPage;