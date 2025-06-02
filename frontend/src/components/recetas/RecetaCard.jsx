"use client"
import { Link } from "react-router-dom"
import "./RecetaCard.css"

const RecetaCard = ({ receta, showActions = false, onEdit, onDelete, onToggleFavorite }) => {
  const {
    id,
    titulo,
    descripcion,
    imagen,
    tiempoPreparacion,
    dificultad,
    categoria,
    region,
    autor,
    calificacion,
    fechaCreacion,
    esFavorita,
  } = receta

  const getDificultadColor = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case "fácil":
        return "#28a745"
      case "medio":
        return "#ffc107"
      case "difícil":
        return "#dc3545"
      default:
        return "#6c757d"
    }
  }

  const formatearTiempo = (minutos) => {
    if (minutos < 60) return `${minutos} min`
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`
  }

  return (
    <div className="receta-card">
      <div className="receta-image-container">
        <img src={imagen || "/placeholder.svg?height=200&width=300"} alt={titulo} className="receta-image" />
        <div className="receta-badges">
          {region && <span className="badge badge-region">{region}</span>}
          <span className="badge badge-dificultad" style={{ backgroundColor: getDificultadColor(dificultad) }}>
            {dificultad}
          </span>
        </div>
        {onToggleFavorite && (
          <button className={`favorite-btn ${esFavorita ? "active" : ""}`} onClick={() => onToggleFavorite(id)}>
            {esFavorita ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <div className="receta-content">
        <div className="receta-header">
          <h3 className="receta-titulo">
            <Link to={`/recetas/${id}`}>{titulo}</Link>
          </h3>
          {calificacion && (
            <div className="receta-rating">
              <span className="stars">{"⭐".repeat(Math.floor(calificacion))}</span>
              <span className="rating-number">({calificacion})</span>
            </div>
          )}
        </div>

        <p className="receta-descripcion">{descripcion}</p>

        <div className="receta-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{formatearTiempo(tiempoPreparacion)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🍽️</span>
            <span>{categoria}</span>
          </div>
          {autor && (
            <div className="meta-item">
              <span className="meta-icon">👨‍🍳</span>
              <span>{autor}</span>
            </div>
          )}
        </div>

        {fechaCreacion && <div className="receta-fecha">Publicado: {new Date(fechaCreacion).toLocaleDateString()}</div>}

        {showActions && (
          <div className="receta-actions">
            <Link to={`/recetas/${id}`} className="btn btn-outline btn-sm">
              Ver Receta
            </Link>
            {onEdit && (
              <button onClick={() => onEdit(id)} className="btn btn-primary btn-sm">
                Editar
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(id)} className="btn btn-danger btn-sm">
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecetaCard
