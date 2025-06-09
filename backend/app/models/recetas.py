from app import db
from datetime import datetime, timezone

class Receta(db.Model):
    __tablename__ = 'recetas'

    id_receta = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    preparacion = db.Column(db.Text)
    imagen_url = db.Column(db.String(255))
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id_categoria', ondelete='SET NULL'), nullable=True)
    region_id = db.Column(db.Integer, db.ForeignKey('regiones.id_region', ondelete='SET NULL'), nullable=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id_usuario', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    dificultad = db.Column(db.String(20), nullable=True)
    tiempo = db.Column(db.Integer, nullable=True)  # minutos
    rating = db.Column(db.Float, nullable=True)

    # Relaciones
    categoria = db.relationship('Categoria', backref='recetas')
    region = db.relationship('Region', backref='recetas')
    usuario = db.relationship('Usuario', backref='recetas')
