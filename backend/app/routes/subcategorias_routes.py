from flask import Blueprint
from app.controllers.subcategoria_controller import (
    obtener_subcategorias_controller,
    obtener_subcategoria_por_id_controller,
    crear_subcategoria_controller,
    actualizar_subcategoria_controller,
    eliminar_subcategoria_controller
)

subcategorias_bp = Blueprint('subcategorias_bp', __name__)

@subcategorias_bp.route('/', methods=['GET'])
def obtener_subcategorias_route():
    return obtener_subcategorias_controller()

@subcategorias_bp.route('/<int:id_subcategoria>', methods=['GET'])
def obtener_subcategoria_route(id_subcategoria):
    return obtener_subcategoria_por_id_controller(id_subcategoria)

@subcategorias_bp.route('/', methods=['POST'])
def crear_subcategoria_route():
    return crear_subcategoria_controller()

@subcategorias_bp.route('/<int:id_subcategoria>', methods=['PUT'])
def actualizar_subcategoria_route(id_subcategoria):
    return actualizar_subcategoria_controller(id_subcategoria)

@subcategorias_bp.route('/<int:id_subcategoria>', methods=['DELETE'])
def eliminar_subcategoria_route(id_subcategoria):
    return eliminar_subcategoria_controller(id_subcategoria)
