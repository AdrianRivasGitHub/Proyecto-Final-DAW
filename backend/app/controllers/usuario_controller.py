from flask import jsonify, request
from app.schemas.usuario_schema import UsuarioSchema
from app.services.usuario_service import listar_usuarios, crear_usuario

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

def obtener_usuarios_controller():
    usuarios = listar_usuarios()
    resultado = usuarios_schema.dump(usuarios)  #Serializamos la lista de usuarios
    return jsonify(resultado), 200

def crear_usuario_controller():
    data = request.get_json()  #Recibe los datos enviados en la petición
    errores = usuario_schema.validate(data)

    if errores:
        return jsonify(errores), 400

    nuevo_usuario = crear_usuario(data)
    resultado = usuario_schema.dump(nuevo_usuario)  #Serializamos el nuevo usuario
    return jsonify(resultado), 201