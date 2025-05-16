from app import ma
from marshmallow import fields
from app.models.recetas import Receta

class RecetaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Receta
        load_instance = True
        include_fk = True  #Para incluir las claves foráneas en el schema

    id_receta = ma.auto_field()
    nombre = ma.auto_field(required=True)
    descripcion = ma.auto_field()
    preparacion = ma.auto_field()
    imagen_url = ma.auto_field()
    categoria_id = ma.auto_field(required=True)
    region_id = ma.auto_field(required=True)
    usuario_id = ma.auto_field(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    #Mostrar los nombres de las relaciones en lugar de los IDs:
    categoria = fields.Nested('CategoriaSchema', only=['nombre'])
    region = fields.Nested('RegionSchema', only=['nombre'])
    usuario = fields.Nested('UsuarioSchema', only=['nombre', 'correo'])
