from flask import Blueprint
from app.controllers.usuario_controller import obtener_usuarios_controller, crear_usuario_controller

usuarios_bp = Blueprint('usuarios_bp', __name__)

# Ruta para listar todos los usuarios
@usuarios_bp.route('/', methods=['GET'])
def listar_usuarios_route():
    return obtener_usuarios_controller()

# Ruta para crear un nuevo usuario
@usuarios_bp.route('/', methods=['POST'])
def crear_usuario_route():
    return crear_usuario_controller()