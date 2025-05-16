from flask import jsonify, request
from app.schemas.usuario_schema import UsuarioSchema
from app.services.usuario_service import (
    listar_usuarios,
    obtener_usuario_por_id,
    crear_usuario,
    actualizar_usuario,
    eliminar_usuario,
    obtener_usuario_por_correo
)

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

def obtener_usuarios_controller():
    usuarios = listar_usuarios()
    resultado = usuarios_schema.dump(usuarios)  #Serializamos la lista de usuarios
    return jsonify(resultado), 200

def obtener_usuario_por_id_controller(id_usuario):
    usuario = obtener_usuario_por_id(id_usuario)
    if not usuario:
        return jsonify({'Error': 'Usuario no encontrado'}), 404
    
    return jsonify(usuario_schema.dump(usuario)), 200

def crear_usuario_controller():
    data = request.get_json()  #Recibe los datos enviados en la petición
    errores = usuario_schema.validate(data)

    if errores:
        return jsonify(errores), 400

    nuevo_usuario = crear_usuario(data)
    resultado = usuario_schema.dump(nuevo_usuario)  #Serializamos el nuevo usuario
    return jsonify(resultado), 201

def actualizar_usuario_controller(id_usuario):
    data = request.get_json()
    errores = usuario_schema.validate(data, partial=True)

    if errores:
        return jsonify(errores), 400
    
    usuario = actualizar_usuario(id_usuario, data)
    if not usuario:
        return jsonify({'Error': 'Usuario no encontrado'}), 404
    
    return jsonify(usuario_schema.dump(usuario)), 200

def eliminar_usuario_controller(id_usuario):
    usuario = eliminar_usuario(id_usuario)
    if not usuario:
        return jsonify({'Error': 'Usuario no encontrado'}), 404
    return jsonify({'Mensaje': 'Usuario eliminado correctamente'}), 200

def obtener_usuario_por_correo_controller(correo):
    usuario = obtener_usuario_por_correo(correo)
    if not usuario:
        return jsonify({'Error': 'Usuario no encontrado'}), 404
    return jsonify(usuario_schema.dump(usuario)), 200