from app import db

class Region(db.Model):
    __tablename__ = 'regiones'

    id_region = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
