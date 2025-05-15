from app import ma
from app.models.receta_alergeno import RecetaAlergeno
from marshmallow import fields

class RecetaAlergenoSchema(ma.SQLAlchemySchema):
    class Meta:
        model = RecetaAlergeno
        load_instance = True
        include_fk = True

    id = ma.auto_field()
    receta_id = ma.auto_field(required=True)
    alergeno_id = ma.auto_field(required=True)

    alergeno = fields.Nested('AlergenoSchema', only=['nombre'])
    receta = fields.Nested('RecetaSchema', only=['nombre'])