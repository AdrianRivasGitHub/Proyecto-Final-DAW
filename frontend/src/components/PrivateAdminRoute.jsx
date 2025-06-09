import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateAdminRoute = () => {
  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  let usuario = null;

  if (usuarioString) {
    try {
      usuario = JSON.parse(usuarioString);
    } catch (error) {
      console.error("Error al parsear datos de usuario:", error);
    }
  }

  return token && usuario && usuario.rol && usuario.rol.nombre_rol === 'Admin' ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateAdminRoute;