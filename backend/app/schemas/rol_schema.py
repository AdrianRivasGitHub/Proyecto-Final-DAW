from app import ma
from app.models.roles import Rol

class RolSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Rol
        load_instance = True

    id_rol = ma.auto_field()
    nombre_rol = ma.auto_field()