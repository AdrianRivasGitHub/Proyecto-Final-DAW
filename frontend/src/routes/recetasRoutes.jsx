import React from 'react';
import { Route } from "react-router-dom";
import ListaRecetas from '../pages/recetas/ListaRecetas';
import DetalleReceta from '../pages/recetas/DetalleReceta';

export default function RecetasRoutes() {
  return (
    <>
    <Route path="/recetas" element={<ListaRecetas />} />
    <Route path="/recetas/:id" element={<DetalleReceta />} />
    </>
  );
}
