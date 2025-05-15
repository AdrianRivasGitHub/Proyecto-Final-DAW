from app import db
from datetime import datetime, timezone

class Receta(db.Model):
    __tablename__ = 'recetas'

    id_receta = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    preparacion = db.Column(db.Text)
    imagen_url = db.Column(db.String(255))
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id_categoria'), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('regiones.id_region'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id_usuario'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relaciones
    categoria = db.relationship('Categoria', backref='recetas')
    region = db.relationship('Region', backref='recetas')
    usuario = db.relationship('Usuario', backref='recetas')
