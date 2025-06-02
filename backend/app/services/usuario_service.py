from app.models.usuarios import Usuario
from app import db

def listar_usuarios():
    return Usuario.query.order_by(Usuario.id_usuario.asc()).all()

def obtener_usuario_por_id(id_usuario):
    return Usuario.query.get(id_usuario)

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

def actualizar_usuario(id_usuario, data):
    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return None

    usuario.nombre = data.get('nombre', usuario.nombre)
    usuario.correo = data.get('correo', usuario.correo)
    usuario.contraseña = data.get('contraseña', usuario.contraseña)
    usuario.rol_id = data.get('rol_id', usuario.rol_id)

    db.session.commit()
    return usuario

def eliminar_usuario(id_usuario):
    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return None

    db.session.delete(usuario)
    db.session.commit()
    return usuario

def obtener_usuario_por_correo(correo):
    return Usuario.query.filter_by(correo=correo).first()
