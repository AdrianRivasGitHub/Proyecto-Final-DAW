from app import ma
from app.models.ingredientes import Ingrediente
from marshmallow import fields, validate

class IngredienteSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Ingrediente
        load_instance = True
        include_fk = True

    id_ingrediente = ma.auto_field()
    nombre = ma.auto_field(
        required=True,
        validate=validate.Length(min=3, max=50, error='El Nombre debe tener mínimo 3 caracteres')
        )
    descripcion = ma.auto_field()
    alergeno_id = ma.auto_field()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)    

    alergeno = fields.Nested('AlergenoSchema', only=['nombre'])