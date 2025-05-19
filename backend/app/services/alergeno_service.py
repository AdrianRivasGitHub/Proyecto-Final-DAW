from app.models.alergenos import Alergeno

def listar_alergenos():
    return Alergeno.query.all()
