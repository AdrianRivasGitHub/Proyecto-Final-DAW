import React from 'react';
import { Route } from "react-router-dom";
import PanelAdmin from '../pages/admin/PanelAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardAdmin from '@/pages/admin/DashboardAdmin';
import ListaUsuarios from '@/pages/admin/ListaUsuarios';
import ListaSubcategorias from '@/pages/admin/ListaSubcategorias';
import ListaIngredientes from '@/pages/admin/ListaIngredientes';
import ListaRecetas from '@/pages/admin/ListaRecetas';
import FormularioReceta from '@/pages/admin/FormularioReceta';
import DetalleReceta from '@/pages/admin/DetalleReceta';

export default function AdminRoutes() {
  return (
    <>
      <Route path="/admin" element={<DashboardAdmin />}  />
      <Route path="/admin/usuarios" element={<ListaUsuarios />} />
      <Route path="/admin/recetas" element={<ListaRecetas />} />
      <Route path="/admin/recetas/nuevo" element={<FormularioReceta />} />
      <Route path="admin/recetas/:id" element={<DetalleReceta />} />
      <Route path="admin/recetas/:id/editar" element={<FormularioReceta />} />
      <Route path="/admin/ingredientes" element={<ListaIngredientes />} />
      <Route path="/admin/subcategorias" element={<ListaSubcategorias />} />
    </>
  );
}
