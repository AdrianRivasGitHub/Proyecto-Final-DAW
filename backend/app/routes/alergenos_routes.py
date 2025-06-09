from flask import Blueprint
from app.controllers.alergeno_controller import obtener_alergenos_controller

alergenos_bp = Blueprint('alergenos_bp', __name__)

@alergenos_bp.route('', methods=['GET'])
def obtener_alergenos_route():
    return obtener_alergenos_controller()
