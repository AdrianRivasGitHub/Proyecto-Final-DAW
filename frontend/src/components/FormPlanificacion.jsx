import { useState, useEffect } from 'react';
import { createPlanificacion } from '../services/planificacionService';
import { getRecetas } from '../services/recetaService';

export default function FormPlanificacion() {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);

  useEffect(() => {
    getRecetas().then(res => setRecetas(res.data));
  }, []);

  const handleAddReceta = () => {
    setSeleccionadas([...seleccionadas, { receta_id: '', categoria_id: '', dia: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      usuario_id: 1, // temporal
      nombre,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      recetas: seleccionadas
    };
    await createPlanificacion(data);
    alert('Planificación creada');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
      <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />

      {seleccionadas.map((item, index) => (
        <div key={index}>
          <select onChange={e => {
            const updated = [...seleccionadas];
            updated[index].receta_id = e.target.value;
            setSeleccionadas(updated);
          }}>
            <option value="">-- Receta --</option>
            {recetas.map(r => (
              <option key={r.id_receta} value={r.id_receta}>{r.nombre}</option>
            ))}
          </select>
          {/* Campos para día y categoría aquí */}
        </div>
      ))}

      <button type="button" onClick={handleAddReceta}>Agregar receta</button>
      <button type="submit">Guardar planificación</button>
    </form>
  );
}
