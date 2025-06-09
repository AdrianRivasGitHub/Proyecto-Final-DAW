from flask import Blueprint
from app.controllers.planificacion_controller import (
    crear_planificacion_controller,
    listar_planificaciones_por_usuario_controller,
    obtener_planificacion_controller,
    actualizar_planificacion_controller,
    eliminar_planificacion_controller
)

planificaciones_bp = Blueprint('planificaciones_bp', __name__)

@planificaciones_bp.route('', methods=['POST'])
def crear_planificacion_route():
    return crear_planificacion_controller()

@planificaciones_bp.route('/usuario/<int:usuario_id>', methods=['GET'])
def listar_planificaciones_usuario_route(usuario_id):
    return listar_planificaciones_por_usuario_controller(usuario_id)

@planificaciones_bp.route('/<int:id_planificacion>', methods=['GET'])
def obtener_planificacion_route(id_planificacion):
    return obtener_planificacion_controller(id_planificacion)

@planificaciones_bp.route('/<int:id_planificacion>', methods=['PUT'])
def actualizar_planificacion_route(id_planificacion):
    return actualizar_planificacion_controller(id_planificacion)

@planificaciones_bp.route('/<int:id_planificacion>', methods=['DELETE'])
def eliminar_planificacion_route(id_planificacion):
    return eliminar_planificacion_controller(id_planificacion)
