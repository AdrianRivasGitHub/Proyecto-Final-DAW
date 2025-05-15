from app import ma
from app.models.alergenos import Alergeno

class AlergenoSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Alergeno
        load_instance = True

    id_alergeno = ma.auto_field()
    nombre = ma.auto_field(required=True)
    descripcion = ma.auto_field()
