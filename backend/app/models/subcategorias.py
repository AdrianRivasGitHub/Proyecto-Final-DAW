from app import db

class Subcategoria(db.Model):
    __tablename__ = 'subcategorias'

    id_subcategoria = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text)