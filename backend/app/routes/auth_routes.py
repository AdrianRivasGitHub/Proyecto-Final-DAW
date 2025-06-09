from flask import Blueprint
from app.controllers.auth_controller import registro_controller, login_controller

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/registro', methods=['POST'])
def registro_route():
    return registro_controller()

@auth_bp.route('/login', methods=['POST'])
def login_route():
    return login_controller()
