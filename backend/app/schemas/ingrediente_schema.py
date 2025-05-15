from app import ma
from app.models.ingredientes import Ingrediente
from marshmallow import fields

class IngredienteSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Ingrediente
        load_instance = True
        include_fk = True

    id_ingrediente = ma.auto_field()
    nombre = ma.auto_field(required=True)
    descripcion = ma.auto_field()
    alergeno_id = ma.auto_field()

    alergeno = fields.Nested('AlergenoSchema', only=['nombre'])