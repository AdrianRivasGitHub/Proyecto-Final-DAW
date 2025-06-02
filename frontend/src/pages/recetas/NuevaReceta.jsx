import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recetasService from '../../services/recetaService';

const NuevaReceta = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    preparacion: '',
    subcategoriaId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recetasService.crearReceta(formData);
      alert('Receta guardada correctamente');
      navigate('/recetas');
    } catch (error) {
      console.error('Error al guardar receta:', error);
      alert('Ocurrió un error al guardar la receta.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nueva Receta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Preparación</label>
          <textarea
            name="preparacion"
            value={formData.preparacion}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar receta
        </button>
      </form>
    </div>
  );
};

export default NuevaReceta;
