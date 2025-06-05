from app import ma
from app.models.planificaciones import Planificacion
from marshmallow import fields, validate

class PlanificacionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Planificacion
        load_instance = True
        include_fk = True

    id_planificacion = ma.auto_field()
    usuario_id = ma.auto_field(required=True)
    nombre = ma.auto_field(
        required=True,
        validate=validate.Length(min=5, max=50, error='El Nombre debe tener mínimo 5 caracteres')
    )
    fecha_inicio = ma.auto_field(required=True)
    fecha_fin = ma.auto_field(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    usuario = fields.Nested('UsuarioSchema', only=['nombre', 'correo'])
    # Lista de recetas planificadas asociadas a la planificación
    recetas_planificadas = fields.Nested('PlanificacionRecetaSchema', many=True)