import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecetasRoutes from "./recetasRoutes";
import AdminRoutes from './adminRoutes';
import Dashboard from '../pages/Dashboard';
import Blog from '@/pages/Blog';
import LoginPage from '@/pages/Login';
import RegistroPage from '@/pages/Registro';
import PublicRoute from '@/components/PublicRoute';
import PrivateRoute from '@/components/PrivateRoute';
import PrivateAdminRoute from '@/components/PrivateAdminRoute';
import Favoritos from '@/pages/usuario/Favoritos';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/blog" element={<Blog />} />
      {RecetasRoutes()}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/favoritos" element={<Favoritos />} />
      </Route>
      <Route element={<PrivateAdminRoute />}>
        {AdminRoutes()}
      </Route>
    </Routes>
  );
}

export default AppRoutes;