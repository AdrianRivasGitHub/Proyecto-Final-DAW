from flask import Blueprint
from app.controllers.ingrediente_controller import (
    listar_ingredientes_controller,
    obtener_ingrediente_por_id_controller,
    crear_ingrediente_controller,
    actualizar_ingrediente_controller,
    eliminar_ingrediente_controller
)

ingredientes_bp = Blueprint('ingredientes_bp', __name__)

@ingredientes_bp.route('/', methods=['GET'])
def obtener_ingredientes_route():
    return listar_ingredientes_controller()

@ingredientes_bp.route('/<int:id_ingrediente>', methods=['GET'])
def obtener_ingrediente_routes(id_ingrediente):
    return obtener_ingrediente_por_id_controller(id_ingrediente)

@ingredientes_bp.route('/', methods=['POST'])
def crear_ingrediente_routes():
    return crear_ingrediente_controller()

@ingredientes_bp.route('/<int:id_ingrediente>', methods=['PUT'])
def actualizar_ingrediente_routes(id_ingrediente):
    return actualizar_ingrediente_controller(id_ingrediente)

@ingredientes_bp.route('/<int:id_ingrediente>', methods=['DELETE'])
def eliminar_ingrediente_routes(id_ingrediente):
    return eliminar_ingrediente_controller(id_ingrediente)
