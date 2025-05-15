from app import ma
from app.models.categorias import Categoria

class CategoriaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Categoria
        load_instance = True

    id_categoria = ma.auto_field()
    nombre = ma.auto_field()
