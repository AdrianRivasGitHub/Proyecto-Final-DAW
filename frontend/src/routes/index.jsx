import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecetasRoutes from "./recetasRoutes";
import AdminRoutes from './adminRoutes';
import Dashboard from '../pages/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {RecetasRoutes()}
      {AdminRoutes()}
    </Routes>
  );
}

export default AppRoutes;