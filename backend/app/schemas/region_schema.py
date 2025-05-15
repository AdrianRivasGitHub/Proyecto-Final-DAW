from app import ma
from app.models.regiones import Region

class RegionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Region
        load_instance = True

    id_region = ma.auto_field()
    nombre = ma.auto_field()
