from flask import Blueprint
from app.controllers.favorito_controller import (
    agregar_favorito_controller,
    eliminar_favorito_controller,
    listar_favoritos_por_usuario_controller
)

favoritos_bp = Blueprint('favoritos_bp', __name__)

@favoritos_bp.route('', methods=['POST'])
def agregar_favorito_route():
    return agregar_favorito_controller()

@favoritos_bp.route('/<int:id_favorito>', methods=['DELETE'])
def eliminar_favorito_route(id_favorito):
    return eliminar_favorito_controller(id_favorito)

@favoritos_bp.route('/usuario/<int:usuario_id>', methods=['GET'])
def listar_favoritos_por_usuario_route(usuario_id):
    return listar_favoritos_por_usuario_controller(usuario_id)
