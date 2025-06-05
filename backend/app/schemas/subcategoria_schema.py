from app import ma
from app.models.subcategorias import Subcategoria
from marshmallow import validate

class SubcategoriaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Subcategoria
        load_instance = True

    id_subcategoria = ma.auto_field(dump_only=True)
    nombre = ma.auto_field(
        required=True,
        validate=validate.Length(min=3, max=50, error='El Nombre debe tener mínimo 3 caracteres')
    )
    descripcion = ma.auto_field()
