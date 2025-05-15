from app import ma
from app.models.receta_ingrediente import RecetaIngrediente
from marshmallow import fields

class RecetaIngredienteSchema(ma.SQLAlchemySchema):
    class Meta:
        model = RecetaIngrediente
        load_instance = True
        include_fk = True

    id = ma.auto_field()
    receta_id = ma.auto_field(required=True)
    ingrediente_id = ma.auto_field(required=True)
    cantidad = ma.auto_field(required=True)
    unidad = ma.auto_field(required=True)

    ingrediente = fields.Nested('IngredienteSchema', only=['nombre'])
    receta = fields.Nested('RecetaSchema', only=['nombre'])