from app import ma
from app.models.usuarios import Usuario
from marshmallow import fields, validate

class UsuarioSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Usuario
        load_instance = True 
        # fields = ("id_usuario", "nombre", "correo", "rol_id", "created_at")

    id_usuario = ma.auto_field(dump_only=True)
    nombre = ma.auto_field(
        required=True, 
        validate=validate.Length(min=3, max=50, error='El Nombre debe tener mínimo 3 caracteres')
    )
    correo = ma.auto_field(
        required=True,
        validate=validate.Email(error='Correo electrónico inválido')
    )
    contraseña = ma.Str(
        required=True, 
        validate=validate.Length(min=7, max=50, error='La contraseña debe tener mínimo 7 caracteres'),
        load_only=True)
    rol_id = ma.auto_field(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    rol = fields.Nested('RolSchema', only=['nombre_rol'])

# usuario_schema = UsuarioSchema()
# usuarios_schema = UsuarioSchema(many=True)
