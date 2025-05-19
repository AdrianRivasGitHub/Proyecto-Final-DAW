from flask import Blueprint
from app.controllers.categoria_controller import obtener_categorias_controller

categorias_bp = Blueprint('categorias_bp', __name__)

@categorias_bp.route('/', methods=['GET'])
def obtener_categorias_route():
    return obtener_categorias_controller()
