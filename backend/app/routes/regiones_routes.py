from flask import Blueprint
from app.controllers.region_controller import obtener_regiones_controller

regiones_bp = Blueprint('regiones_bp', __name__)

@regiones_bp.route('/', methods=['GET'])
def obtener_regiones_route():
    return obtener_regiones_controller()
