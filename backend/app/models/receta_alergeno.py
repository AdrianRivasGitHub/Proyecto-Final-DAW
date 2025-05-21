from app import db

class RecetaAlergeno(db.Model):
    __tablename__ = 'receta_alergeno'

    id = db.Column(db.Integer, primary_key=True)
    receta_id = db.Column(db.Integer, db.ForeignKey('recetas.id_receta'), nullable=False)
    alergeno_id = db.Column(db.Integer, db.ForeignKey('alergenos.id_alergeno'), nullable=False)

    # Relaciones
    receta = db.relationship('Receta', backref=db.backref('alergenos_receta', cascade='all, delete-orphan'))
    alergeno = db.relationship('Alergeno', backref=db.backref('recetas_alergeno', cascade='all, delete-orphan'))

    __table_args__ = (
        db.UniqueConstraint('receta_id', 'alergeno_id', name='uq_receta_alergeno'),
    )