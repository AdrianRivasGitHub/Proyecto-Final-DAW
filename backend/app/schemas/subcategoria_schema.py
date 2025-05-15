from app import ma
from app.models.subcategorias import Subcategoria

class SubcategoriaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Subcategoria
        load_instance = True

    id_subcategoria = ma.auto_field()
    nombre = ma.auto_field(required=True)
    descripcion = ma.auto_field()
