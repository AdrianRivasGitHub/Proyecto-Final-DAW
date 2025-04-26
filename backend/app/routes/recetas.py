from flask import Blueprint, jsonify

recetas_bp = Blueprint("recetas", __name__)

@recetas_bp.route("/", methods=["GET"])
def hello():
    return jsonify({"mensaje": "¡La API de recetas está funcionando!"})
