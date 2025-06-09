import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import FormPlanificacion from './components/FormPlanificacion';
// import CrearUsuarioPage from './pages/CrearUsuarioPage';
// import UsuariosPage from './pages/UsuariosPage';
// import RecetasRoutes from './routes/recetasRoutes';
import AppRoutes from './routes';


function App() {

  return (
    <>
        {/* <Routes> */}
            {/* <Route path="/" element={<Dashboard />} /> */}
            {/* <Route path="/" element={<FormPlanificacion />} /> */}
            {/* <Route path="/" element={<CrearUsuarioPage />} /> */}
            {/* <Route path="/" element={<RecipesPage />} /> */}
            {/* <Route path="/usuarios" element={<UsuariosPage />} /> */}
            {/* {RecetasRoutes()} */}
            {/* {AppRoutes()} */}
        {/* </Routes> */}
      <AppRoutes></AppRoutes>
    </>
  );
}

export default App
