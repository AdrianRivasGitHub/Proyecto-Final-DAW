from app import db

class RecetaIngrediente(db.Model):
    __tablename__ = 'receta_ingrediente'

    id = db.Column(db.Integer, primary_key=True)
    receta_id = db.Column(db.Integer, db.ForeignKey('recetas.id_receta'), nullable=False)
    ingrediente_id = db.Column(db.Integer, db.ForeignKey('ingredientes.id_ingrediente'), nullable=False)
    cantidad = db.Column(db.String(100), nullable=False) 
    unidad = db.Column(db.String(50), nullable=False)

    # Relaciones
    receta = db.relationship('Receta', backref=db.backref('ingredientes_receta', cascade='all, delete-orphan'))
    ingrediente = db.relationship('Ingrediente', backref=db.backref('recetas_ingrediente', cascade='all, delete-orphan'))

    __table_args__ = (
        db.UniqueConstraint('receta_id', 'ingrediente_id', name='uq_receta_ingrediente'),
    )
