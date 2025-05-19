from app.models.categorias import Categoria

def listar_categorias():
    return Categoria.query.all()
