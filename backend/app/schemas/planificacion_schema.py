from app import ma
from app.models.planificaciones import Planificacion
from marshmallow import fields

class PlanificacionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Planificacion
        load_instance = True
        include_fk = True

    id_planificacion = ma.auto_field()
    usuario_id = ma.auto_field(required=True)
    nombre = ma.auto_field(required=True)
    fecha_inicio = ma.auto_field(required=True)
    fecha_fin = ma.auto_field(required=True)

    usuario = fields.Nested('UsuarioSchema', only=['nombre', 'correo'])
