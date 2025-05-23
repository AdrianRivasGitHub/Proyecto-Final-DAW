import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsuariosPage() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/usuarios';

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_URL);
        setUsuarios(response.data);
      } catch (err) {
        console.error('Error al cargar los usuarios:', err);
        setError('Error al cargar los usuarios. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  if (loading) {
    return <div className="container mt-5 text-center"><p>Cargando usuarios...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Usuarios</h1>
      {usuarios.length === 0 && !loading ? (
        <div className="alert alert-info mt-4" role="alert">
          No hay usuarios para mostrar.
        </div>
      ) : (
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol?.nombre_rol || 'Sin rol'}</td> {/* Manejo seguro del rol */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsuariosPage;