from flask import jsonify, request
from app.schemas.receta_schema import RecetaSchema
from app.services.receta_service import (
    crear_receta,
    listar_recetas,
    buscar_recetas,
    obtener_receta_por_id,
    actualizar_receta,
    eliminar_receta,
    listar_recetas_por_categoria, 
    listar_recetas_por_region
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
    receta = obtener_receta_por_id(id_receta)
    
    if receta is None:
        return jsonify({'Error': 'Receta no encontrada'}), 404

    resultado = receta_schema.dump(receta)
    return jsonify(resultado), 200

def listar_recetas_por_categoria_controller(categoria_id):
    recetas = listar_recetas_por_categoria(categoria_id)
    return jsonify(recetas_schema.dump(recetas)), 200

def listar_recetas_por_region_controller(region_id):
    recetas = listar_recetas_por_region(region_id)
    return jsonify(recetas_schema.dump(recetas)), 200

def crear_receta_controller():
    data = request.get_json()
    errores = receta_schema.validate(data)

    if errores:
        return jsonify(errores), 400
    
    # Validamos que venga el array de ingrediente por lo menos
    ingredientes = data.get('ingredientes')
    if not ingredientes or not isinstance(ingredientes, list):
        return jsonify({"Error": "Debe enviar una lista de ingredientes para la receta"}), 400    

    # Creamos la receta con ingredientes, alergenos y subcategorias
    try:
        nueva_receta = crear_receta(data)
    except ValueError as ve:
        return jsonify({"Error": str(ve)}), 400
    except Exception as e:
        return jsonify({"Error": str(e)}), 500
    
    resultado = receta_schema.dump(nueva_receta)
    return jsonify(resultado), 201

def actualizar_receta_controller(id_receta):
    data = request.get_json()
    errores = receta_schema.validate(data, partial=True)

    if errores:
        return jsonify(errores), 400
    
    try:
        receta_actualizada = actualizar_receta(id_receta, data)
    except ValueError as ve:
        return jsonify({"Error": str(ve)}), 400
    except Exception as e:
        return jsonify({"Error": str(e)}), 500    

    if not receta_actualizada:
        return jsonify({'Error': 'Receta no encontrada'}), 404
    return jsonify(receta_schema.dump(receta_actualizada)), 200
    
def eliminar_receta_controller(id_receta):
    receta_eliminada = eliminar_receta(id_receta)
    if not receta_eliminada:
        return jsonify({'Error': 'Receta no encontrada'}), 404
    return jsonify({'Mensaje': 'Receta eliminada correctamente'}), 204
    