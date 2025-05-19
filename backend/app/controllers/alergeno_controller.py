from flask import jsonify
from app.services.alergeno_service import listar_alergenos
from app.schemas.alergeno_schema import AlergenoSchema

alergeno_schema = AlergenoSchema(many=True)

def obtener_alergenos_controller():
    alergenos = listar_alergenos()
    return jsonify(alergeno_schema.dump(alergenos)), 200
