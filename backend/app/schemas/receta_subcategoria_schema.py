from app import ma
from app.models.receta_subcategoria import RecetaSubcategoria
from marshmallow import fields

class RecetaSubcategoriaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = RecetaSubcategoria
        load_instance = True
        include_fk = True

    id = ma.auto_field()
    receta_id = ma.auto_field(required=True)
    subcategoria_id = ma.auto_field(required=True)

    receta = fields.Nested('RecetaSchema', only=['nombre'])
    subcategoria = fields.Nested('SubcategoriaSchema', only=['nombre'])