from app import ma
from app.models.planificacion_receta import PlanificacionReceta
from marshmallow import fields

class PlanificacionRecetaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = PlanificacionReceta
        load_instance = True
        include_fk = True

    id = ma.auto_field()
    planificacion_id = ma.auto_field(required=True)
    receta_id = ma.auto_field(required=True)
    categoria_id = ma.auto_field(required=True)
    dia = ma.auto_field(required=True)

    receta = fields.Nested('RecetaSchema', only=['nombre', 'imagen_url'])
    categoria = fields.Nested('CategoriaSchema', only=['nombre'])
    planificacion = fields.Nested('PlanificacionSchema', only=['nombre'])
    