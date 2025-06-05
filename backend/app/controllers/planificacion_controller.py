from flask import request, jsonify
from app.schemas.planificacion_schema import PlanificacionSchema
from app.services.planificacion_service import (
    crear_planificacion,
    listar_planificaciones_por_usuario,
    obtener_planificacion,
    actualizar_planificacion,
    eliminar_planificacion
)
from app.helpers.planificacion_helper import validar_fechas_planificacion

planificacion_schema = PlanificacionSchema()
planificaciones_schema = PlanificacionSchema(many=True)

def crear_planificacion_controller():
    data = request.get_json()
    errores = planificacion_schema.validate(data)
    
    if errores:
        return jsonify(errores), 400

    # Validamos fechas
    try:
        validar_fechas_planificacion(data['fecha_inicio'], data['fecha_fin'])
    except ValueError as ve:
        return jsonify({"Error": str(ve)}), 400

    # Validamos que venga el array de recetas
    recetas = data.get('recetas')
    if not recetas or not isinstance(recetas, list):
        return jsonify({"Error": "Debe enviar un array de recetas para la planificación"}), 400
    
    # Creamos la planificación con recetas incluidas
    try:
        nueva_planificacion = crear_planificacion(data)
    except ValueError as ve:
        return jsonify({"Error": str(ve)}), 400
    except Exception as e:
        return jsonify({"Error": str(e)}), 500
    
    resultado = planificacion_schema.dump(nueva_planificacion)
    return jsonify(resultado), 201

def listar_planificaciones_por_usuario_controller(usuario_id):
    planificaciones = listar_planificaciones_por_usuario(usuario_id)
    return jsonify(planificaciones_schema.dump(planificaciones)), 200

def obtener_planificacion_controller(id_planificacion):
    planificacion = obtener_planificacion(id_planificacion)

    if planificacion is None:
        return jsonify({"Error": "Planificación no encontrada"}), 404
    
    resultado = planificacion_schema.dump(planificacion)
    return jsonify(resultado), 200

def actualizar_planificacion_controller(id_planificacion):
    data = request.get_json()
    errores = planificacion_schema.validate(data, partial=True)
    
    if errores:
        return jsonify(errores), 400

    # Validar fechas solo si se envían en el update
    if 'fecha_inicio' in data and 'fecha_fin' in data:
        try:
            validar_fechas_planificacion(data['fecha_inicio'], data['fecha_fin'])
        except ValueError as ve:
            return jsonify({"Error": str(ve)}), 400

    try:
        planificacion_actualizada = actualizar_planificacion(id_planificacion, data)
    except ValueError as ve:
        return jsonify({"Error": str(ve)}), 400
    except Exception as e:
        return jsonify({"Error": str(e)}), 500
    
    if not planificacion_actualizada:
        return jsonify({"Error": "Planificación no encontrada"}), 404
    return jsonify(planificacion_schema.dump(planificacion_actualizada)), 200

def eliminar_planificacion_controller(id_planificacion):
    planificacion_eliminada = eliminar_planificacion(id_planificacion)
    if not planificacion_eliminada:
        return jsonify({"Error": "Planificación no encontrada"}), 404
    return jsonify({"Mensaje": "Planificación eliminada correctamente"}), 204
