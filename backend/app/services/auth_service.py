from app.models.usuarios import Usuario
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

def registrar_usuario(nombre, correo, contraseña, rol_id=3):
    if Usuario.query.filter_by(correo=correo).first():
        return None, 'El correo ya está registrado.'
    hashed_password = generate_password_hash(contraseña)
    nuevo_usuario = Usuario(nombre=nombre, correo=correo, contraseña=hashed_password, rol_id=rol_id)
    db.session.add(nuevo_usuario)
    db.session.commit()
    return nuevo_usuario, None

def autenticar_usuario(identificador, contraseña):
    usuario = Usuario.query.filter(
        (Usuario.correo == identificador) | (Usuario.nombre == identificador)
    ).first()
    if usuario and check_password_hash(usuario.contraseña, contraseña):
        return usuario
    return None
