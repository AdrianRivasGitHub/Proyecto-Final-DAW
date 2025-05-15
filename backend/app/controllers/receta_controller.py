from flask import jsonify, request
from app.schemas.receta_schema import RecetaSchema
from app.services.receta_service import (
    crear_receta,
    listar_recetas,
    buscar_recetas,
    obtener_receta_por_id
)

receta_schema = RecetaSchema()
recetas_schema = RecetaSchema(many=True)

def obtener_recetas_controller():
    """
    Maneja GET /api/recetas y /api/recetas?nombre=
    """
    nombre = request.args.get('nombre')

    if nombre:
        recetas = buscar_recetas(nombre)
    else:
        recetas = listar_recetas()

    resultado = recetas_schema.dump(recetas)
    return jsonify(resultado), 200


def obtener_receta_por_id_controller(id_receta):
    """
    Maneja GET /api/recetas/<id>
    """
    receta = obtener_receta_por_id(id_receta)
    
    if receta is None:
        return jsonify({'Error': 'Receta no encontrada'}), 404

    resultado = receta_schema.dump(receta)
    return jsonify(resultado), 200

def crear_receta_controller():
    data = request.get_json()
    errores = receta_schema.validate(data)

    if errores:
        return jsonify(errores), 400

    nueva_receta = crear_receta(data)
    resultado = receta_schema.dump(nueva_receta)
    return jsonify(resultado), 201