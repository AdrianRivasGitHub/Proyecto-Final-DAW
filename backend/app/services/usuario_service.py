from app.models.usuarios import Usuario
from app import db

def listar_usuarios():
    return Usuario.query.all()

def crear_usuario(data):
    nuevo_usuario = Usuario(
        nombre=data['nombre'],
        correo=data['correo'],
        contraseña=data['contraseña'],
        rol_id=data['rol_id']
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return nuevo_usuario