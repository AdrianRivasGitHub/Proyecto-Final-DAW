import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;