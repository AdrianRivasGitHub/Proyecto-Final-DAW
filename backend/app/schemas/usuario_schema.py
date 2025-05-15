from app import ma
from app.models.usuarios import Usuario
from marshmallow import fields

class UsuarioSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Usuario
        load_instance = True  #Permite cargar directamente a un objeto Usuario

    id_usuario = ma.auto_field()
    nombre = ma.auto_field(required=True)
    correo = ma.auto_field(required=True)
    contraseña = ma.auto_field(required=True)
    #contraseña = ma.Str(required=True, load_only=True)
    rol_id = ma.auto_field(required=True)

    rol = fields.Nested('RolSchema', only=['nombre_rol'])
