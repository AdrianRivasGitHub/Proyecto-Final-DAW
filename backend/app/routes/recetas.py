from flask import Blueprint, jsonify
from app.controllers.receta_controller import (
    obtener_recetas_controller,
    obtener_receta_por_id_controller,
    crear_receta_controller
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

# Crear receta
@recetas_bp.route('/', methods=['POST'])
def crear_receta():
    return crear_receta_controller()