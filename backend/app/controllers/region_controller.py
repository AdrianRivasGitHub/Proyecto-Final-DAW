from flask import jsonify
from app.services.region_service import listar_regiones
from app.schemas.region_schema import RegionSchema

region_schema = RegionSchema(many=True)

def obtener_regiones_controller():
    regiones = listar_regiones()
    return jsonify(region_schema.dump(regiones)), 200
