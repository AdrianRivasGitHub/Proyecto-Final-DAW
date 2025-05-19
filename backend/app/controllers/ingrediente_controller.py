from flask import request, jsonify
from app.schemas.ingrediente_schema import IngredienteSchema
from app.services.ingrediente_service import (
    listar_ingredientes,
    obtener_ingrediente_por_id,
    crear_ingrediente,
    actualizar_ingrediente,
    eliminar_ingrediente
)

ingrediente_schema = IngredienteSchema()
ingredientes_schema = IngredienteSchema(many=True)

def listar_ingredientes_controller():
    ingredientes = listar_ingredientes()
    resultado = ingrediente_schema.dump(ingredientes)
    return jsonify(resultado), 200

def obtener_ingrediente_por_id_controller(id_ingrediente):
    ingrediente = obtener_ingrediente_por_id(id_ingrediente)

    if not ingrediente:
        return jsonify({'Error': 'Ingrediente no encontrado'}), 404
    resultado = ingrediente_schema.dump(ingrediente)
    return jsonify(resultado), 200

def crear_ingrediente_controller():
    data = request.get_json()
    errores = ingrediente_schema.validate(data)
    if errores:
        return jsonify(errores), 400
    
    nuevo_ingrediente = crear_ingrediente(data)
    resultado = ingrediente_schema.dump(nuevo_ingrediente)
    return jsonify(resultado), 201

def actualizar_ingrediente_controller(id_ingrediente):
    data = request.get_json()
    errores = ingrediente_schema.validate(data, partial=True)

    if errores:
        return jsonify(errores), 400

    ingrediente_actualizado = actualizar_ingrediente(id_ingrediente, data)
    if not ingrediente_actualizado:
        return jsonify({'Error': 'Ingrediente no encontrado'}), 404
    return jsonify(ingrediente_schema.dump(ingrediente_actualizado)), 200

def eliminar_ingrediente_controller(id_ingrediente):
    ingrediente_eliminado = eliminar_ingrediente(id_ingrediente)
    if not ingrediente_eliminado:
        return jsonify({'Error': 'Ingrediente no encontrado'}), 404
    return jsonify({'Mensaje': 'Ingrediente eliminado'}), 200
