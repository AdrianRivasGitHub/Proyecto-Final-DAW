from flask import Blueprint
from app.controllers.usuario_controller import (
    obtener_usuarios_controller,
    crear_usuario_controller,
    obtener_usuario_por_id_controller,
    obtener_usuario_por_correo_controller,
    actualizar_usuario_controller,
    eliminar_usuario_controller
)

usuarios_bp = Blueprint('usuarios_bp', __name__)

# Ruta para listar todos los usuarios
@usuarios_bp.route('', methods=['GET'])
def listar_usuarios_route():
    return obtener_usuarios_controller()

# Ruta para crear un nuevo usuario
@usuarios_bp.route('', methods=['POST'])
def crear_usuario_route():
    return crear_usuario_controller()

# Obtener usuario por ID
@usuarios_bp.route('/<int:id_usuario>', methods=['GET'])
def obtener_usuario_por_id_route(id_usuario):
    return obtener_usuario_por_id_controller(id_usuario)

# Obtener usuario por correo
@usuarios_bp.route('/correo/<string:correo>', methods=['GET'])
def obtener_usuario_por_correo_route(correo):
    return obtener_usuario_por_correo_controller(correo)

# Actualizar usuario
@usuarios_bp.route('/<int:id_usuario>', methods=['PUT'])
def actualizar_usuario_route(id_usuario):
    return actualizar_usuario_controller(id_usuario)

# Eliminar usuario
@usuarios_bp.route('/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario_route(id_usuario):
    return eliminar_usuario_controller(id_usuario)