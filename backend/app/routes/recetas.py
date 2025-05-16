from flask import Blueprint, jsonify
from app.controllers.receta_controller import (
    obtener_recetas_controller,
    obtener_receta_por_id_controller,
    crear_receta_controller,
    actualizar_receta_controller,
    eliminar_receta_controller,
    listar_recetas_por_categoria_controller,
    listar_recetas_por_region_controller
)

recetas_bp = Blueprint("recetas_bp", __name__)

# Listar todas o buscar por nombre
@recetas_bp.route('/', methods=['GET'])
def obtener_recetas_route():
    return obtener_recetas_controller()

# Obtener receta por ID
@recetas_bp.route('/<int:id_receta>', methods=['GET'])
def obtener_receta_por_id_route(id_receta):
    return obtener_receta_por_id_controller(id_receta)

@recetas_bp.route('/categoria/<int:categoria_id>', methods=['GET'])
def recetas_por_categoria_route(categoria_id):
    return listar_recetas_por_categoria_controller(categoria_id)

@recetas_bp.route('/region/<int:region_id>', methods=['GET'])
def recetas_por_region_route(region_id):
    return listar_recetas_por_region_controller(region_id)

# Crear receta
@recetas_bp.route('/', methods=['POST'])
def crear_receta():
    return crear_receta_controller()

@recetas_bp.route('/<int:id_receta>', methods=['PUT'])
def actualizar_receta_route(id_receta):
    return actualizar_receta_controller(id_receta)

@recetas_bp.route('/<int:id_receta>', methods=['DELETE'])
def eliminar_receta_route(id_receta):
    return eliminar_receta_controller(id_receta)