from app import ma
from app.models.favoritos import Favorito
from marshmallow import fields

class FavoritoSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Favorito
        load_instance = True
        include_fk = True

    id_favorito = ma.auto_field()
    usuario_id = ma.auto_field(required=True)
    receta_id = ma.auto_field(required=True)

    receta = fields.Nested('RecetaSchema', only=['nombre', 'imagen_url', 'categoria'])
    usuario = fields.Nested('UsuarioSchema', only=['nombre', 'correo'])
