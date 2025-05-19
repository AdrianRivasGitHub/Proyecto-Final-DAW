from flask import jsonify, request
from app.schemas.subcategoria_schema import SubcategoriaSchema
from app.services.subcategoria_service import (
    obtener_subcategorias,
    obtener_subcategoria_por_id,
    crear_subcategoria,
    actualizar_subcategoria,
    eliminar_subcategoria
)

subcategoria_schema = SubcategoriaSchema()
subcategorias_schema = SubcategoriaSchema(many=True)

def obtener_subcategorias_controller():
    subcategorias = obtener_subcategorias()
    resultado = subcategorias_schema.dump(subcategorias)
    return jsonify(resultado), 200

def obtener_subcategoria_por_id_controller(id_subcategoria):
    subcategoria = obtener_subcategoria_por_id(id_subcategoria)
    if not subcategoria:
        return jsonify({'Error': 'Subcategoría no encontrada'}), 404
    resultado = subcategoria_schema.dump(subcategoria)
    return jsonify(resultado), 200

def crear_subcategoria_controller():
    data = request.get_json()
    errores = subcategoria_schema.validate(data)
    if errores:
        return jsonify(errores), 400

    nueva_subcategoria = crear_subcategoria(data)
    resultado = subcategoria_schema.dump(nueva_subcategoria)
    return jsonify(resultado), 201

def actualizar_subcategoria_controller(id_subcategoria):
    data = request.get_json()
    errores = subcategoria_schema.validate(data, partial=True)
    if errores:
        return jsonify(errores), 400

    subcategoria_actualizada = actualizar_subcategoria(id_subcategoria, data)
    if not subcategoria_actualizada:
        return jsonify({'Error': 'Subcategoría no encontrada'}), 404
    return jsonify(subcategoria_schema.dump(subcategoria_actualizada)), 200

def eliminar_subcategoria_controller(id_subcategoria):
    subcategoria_eliminada = eliminar_subcategoria(id_subcategoria)
    if not subcategoria_eliminada:
        return jsonify({'Error': 'Subcategoría no encontrada'}), 404
    return jsonify({'Mensaje': 'Subcategoría eliminada correctamente'}), 200
