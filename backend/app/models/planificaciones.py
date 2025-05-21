from app import db
from datetime import datetime, timezone

class Planificacion(db.Model):
    __tablename__ = 'planificaciones'

    id_planificacion = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id_usuario'), nullable=False)
    nombre = db.Column(db.String(150), nullable=False)
    fecha_inicio = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relaciones
    usuario = db.relationship('Usuario', backref=db.backref('planificaciones', cascade='all, delete-orphan'))
