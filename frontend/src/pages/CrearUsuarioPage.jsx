import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CrearUsuarioPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rolId, setRolId] = useState('');
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // Para alertas

  const API_ROLES_URL = 'http://localhost:5000/api/roles';
  const API_USUARIOS_URL = 'http://localhost:5000/api/usuarios';

  // Cargar roles al montar el componente
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const response = await axios.get(API_ROLES_URL);
        setRoles(response.data);
        if (response.data.length > 0) {
          setRolId(response.data[0].id_rol); // Seleccionar el primer rol por defecto
        }
      } catch (error) {
        console.error('Error al cargar los roles:', error);
        setMensaje({ texto: 'Error al cargar los roles.', tipo: 'danger' });
      }
    };
    cargarRoles();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensaje({ texto: '', tipo: '' }); // Limpiar mensaje previo

    if (!nombre || !correo || !contraseña || !rolId) {
        setMensaje({ texto: 'Todos los campos son obligatorios.', tipo: 'warning' });
        return;
    }

    try {
      await axios.post(API_USUARIOS_URL, {
        nombre,
        correo,
        contraseña,
        rol_id: parseInt(rolId) // Asegurarse que rol_id es un número 
      });
      setMensaje({ texto: 'Usuario creado exitosamente.', tipo: 'success' });
      // Resetear formulario
      setNombre('');
      setCorreo('');
      setContraseña('');
      if (roles.length > 0) {
        setRolId(roles[0].id_rol);
      } else {
        setRolId('');
      }
    } catch (error) {
      console.error('Error al crear el usuario:', error.response ? error.response.data : error.message);
      const errorMsg = error.response && error.response.data && error.response.data.mensaje
                       ? error.response.data.mensaje
                       : 'Hubo un error al crear el usuario.';
      setMensaje({ texto: errorMsg, tipo: 'danger' });
    }
  };

  return (
    <div className="container mt-5">
<h1 className="text-center">Crear Usuario</h1>
      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="contraseña" className="form-label">Contraseña</label>
          <input type="password" className="form-control" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="rol" className="form-label">Rol</label>
          <select className="form-select" id="rol" value={rolId} onChange={(e) => setRolId(e.target.value)} required>
            {roles.length === 0 && <option value="">Cargando roles...</option>}
            {roles.map(rol => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Crear Usuario</button>
      </form>
    </div>
  );
}

export default CrearUsuarioPage;