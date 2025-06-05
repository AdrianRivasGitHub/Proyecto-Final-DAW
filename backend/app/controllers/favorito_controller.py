from flask import request, jsonify
from app.schemas.favorito_schema import FavoritoSchema
from app.services.favorito_service import (
    agregar_favorito,
    eliminar_favorito,
    listar_favoritos_por_usuario
)

favorito_schema = FavoritoSchema()
favoritos_schema = FavoritoSchema(many=True)

def agregar_favorito_controller():
    data = request.get_json()
    errores = favorito_schema.validate(data)

    if errores:
        return jsonify(errores), 400

    favorito = agregar_favorito(data)
    if favorito is None:
        return jsonify({"Error": "La receta ya está en favoritos."}), 409
    
    resultado = favorito_schema.dump(favorito)
    return jsonify(resultado), 201

def eliminar_favorito_controller(id_favorito):
    favorito_eliminado = eliminar_favorito(id_favorito)
    if not favorito_eliminado: 
        return jsonify({'Error': 'Favorito no encontrado'}), 404
    return jsonify({'Mensaje': 'Favorito eliminado correctamente'}), 204

def listar_favoritos_por_usuario_controller(usuario_id):
    favoritos = listar_favoritos_por_usuario(usuario_id)
    return jsonify(favoritos_schema.dump(favoritos)), 200