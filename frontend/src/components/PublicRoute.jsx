import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;