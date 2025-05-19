from flask import jsonify
from app.services.categoria_service import listar_categorias
from app.schemas.categoria_schema import CategoriaSchema

categoria_schema = CategoriaSchema(many=True)

def obtener_categorias_controller():
    categorias = listar_categorias()
    return jsonify(categoria_schema.dump(categorias)), 200
