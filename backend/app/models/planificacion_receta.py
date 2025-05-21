from app import db

class PlanificacionReceta(db.Model):
    __tablename__ = 'planificacion_receta'

    id = db.Column(db.Integer, primary_key=True)
    planificacion_id = db.Column(db.Integer, db.ForeignKey('planificaciones.id_planificacion'), nullable=False)
    receta_id = db.Column(db.Integer, db.ForeignKey('recetas.id_receta'), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id_categoria'), nullable=False)
    dia = db.Column(db.String(50), nullable=False)  # puede ser un entero (1-7) Lunes, Martes

    # Relaciones
    planificacion = db.relationship('Planificacion', backref=db.backref('recetas_planificadas', cascade='all, delete-orphan'))
    receta = db.relationship('Receta', backref=db.backref('planificaciones_receta', cascade='all, delete-orphan'))
    categoria = db.relationship('Categoria', backref=db.backref('planificacion_receta', cascade='all, delete-orphan'))

    __table_args__ = (
        db.UniqueConstraint('planificacion_id', 'dia', 'categoria_id', name='uq_planificacion_dia_categoria'),
    )