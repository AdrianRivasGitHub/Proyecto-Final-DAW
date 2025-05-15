from app import db

class RecetaSubcategoria(db.Model):
    __tablename__ = 'receta_subcategoria'

    id = db.Column(db.Integer, primary_key=True)
    receta_id = db.Column(db.Integer, db.ForeignKey('recetas.id_receta'), nullable=False)
    subcategoria_id = db.Column(db.Integer, db.ForeignKey('subcategorias.id_subcategoria'), nullable=False)

    # Relaciones
    receta = db.relationship('Receta', backref='subcategorias_receta')
    subcategoria = db.relationship('Subcategoria', backref='recetas_subcategoria')

    __table_args__ = (
        db.UniqueConstraint('receta_id', 'subcategoria_id', name='uq_receta_subcategoria'),
    )
