import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecetasRoutes from "./recetasRoutes";
import Dashboard from '../pages/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {RecetasRoutes()}
    </Routes>
  );
}

export default AppRoutes;