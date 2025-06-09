from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app.services.auth_service import registrar_usuario, autenticar_usuario
from app.schemas.usuario_schema import UsuarioSchema

usuario_schema = UsuarioSchema()

def registro_controller():
    data = request.get_json()
    nombre = data.get('nombre')
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    rol_id = data.get('rol_id', 3)  # Por defecto rol usuario
    if not nombre or not correo or not contraseña:
        return jsonify({'msg': 'Faltan datos obligatorios'}), 400
    usuario, error = registrar_usuario(nombre, correo, contraseña, rol_id)
    if error:
        return jsonify({'msg': error}), 400
    return jsonify({'msg': 'Usuario registrado correctamente'}), 201

def login_controller():
    data = request.get_json()
    identificador = data.get('identificador')   # Puede ser correo o nombre
    contraseña = data.get('contraseña')
    if not identificador or not contraseña:
        return jsonify({'msg': 'Faltan datos'}), 400
    usuario = autenticar_usuario(identificador, contraseña)
    if not usuario:
        return jsonify({'msg': 'Datos incorrectos'}), 401
    access_token = create_access_token(identity=usuario.id_usuario)
    return jsonify({'access_token': access_token, 'usuario': usuario_schema.dump(usuario)}), 200
