from app.models.regiones import Region

def listar_regiones():
    return Region.query.all()