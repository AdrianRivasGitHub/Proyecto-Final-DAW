from app import db
from datetime import datetime, timezone

class Favorito(db.Model):
    __tablename__ = 'favoritos'

    id_favorito = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id_usuario'), nullable=False)
    receta_id = db.Column(db.Integer, db.ForeignKey('recetas.id_receta'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Relaciones
    usuario = db.relationship('Usuario', backref=db.backref('favoritos', cascade='all, delete-orphan'))
    receta = db.relationship('Receta', backref=db.backref('favoritos', cascade='all, delete-orphan'))

    __table_args__ = (
        db.UniqueConstraint('usuario_id', 'receta_id', name='uq_usuario_receta_favorito'),
    )