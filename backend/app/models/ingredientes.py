from app import db
from datetime import datetime, timezone

class Ingrediente(db.Model):
    __tablename__ = 'ingredientes'

    id_ingrediente = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text)
    alergeno_id = db.Column(db.Integer, db.ForeignKey('alergenos.id_alergeno'))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Relaciones
    alergeno = db.relationship('Alergeno', backref='ingredientes')
