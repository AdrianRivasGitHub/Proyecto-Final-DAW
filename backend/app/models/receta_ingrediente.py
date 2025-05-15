from app import db

class RecetaIngrediente(db.Model):
    __tablename__ = 'receta_ingrediente'

    id = db.Column(db.Integer, primary_key=True)
    receta_id = db.Column(db.Integer, db.ForeignKey('recetas.id_receta'), nullable=False)
    ingrediente_id = db.Column(db.Integer, db.ForeignKey('ingredientes.id_ingrediente'), nullable=False)
    cantidad = db.Column(db.String(100), nullable=False) 
    unidad = db.Column(db.String(50), nullable=False)

    # Relaciones
    receta = db.relationship('Receta', backref='ingredientes_receta')
    ingrediente = db.relationship('Ingrediente', backref='recetas_ingrediente')

    __table_args__ = (
        db.UniqueConstraint('receta_id', 'ingrediente_id', name='uq_receta_ingrediente'),
    )
