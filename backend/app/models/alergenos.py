from app import db

class Alergeno(db.Model):
    __tablename__ = 'alergenos'

    id_alergeno = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text)
