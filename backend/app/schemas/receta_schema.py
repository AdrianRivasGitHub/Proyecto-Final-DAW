from app import ma
from marshmallow import fields, validate
from app.models.recetas import Receta

class RecetaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Receta
        load_instance = True
        include_fk = True  #Para incluir las claves foráneas en el schema

    id_receta = ma.auto_field(dump_only=True)
    nombre = ma.auto_field(
        required=True,
        validate=validate.Length(min=3, max=50, error='El Nombre debe tener mínimo 3 caracteres')
    )
    descripcion = ma.auto_field()
    preparacion = ma.auto_field(required=True)
    imagen_url = ma.auto_field()
    categoria_id = ma.auto_field(required=True)
    region_id = ma.auto_field(required=True)
    usuario_id = ma.auto_field(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    # Mostrar los nombres de las relaciones en lugar de los IDs:
    categoria = fields.Nested('CategoriaSchema', only=['nombre'])
    region = fields.Nested('RegionSchema', only=['nombre'])
    usuario = fields.Nested('UsuarioSchema', only=['nombre', 'correo', 'rol'])

    # Listados de ingredientes, alérgenos y subcategorías asociados a la receta
    ingredientes_receta = fields.Nested('RecetaIngredienteSchema', many=True, dump_only=True)
    alergenos_receta = fields.Nested('RecetaAlergenoSchema', many=True, dump_only=True)
    subcategorias_receta = fields.Nested('RecetaSubcategoriaSchema', many=True, dump_only=True)
