from app.models.usuarios import Usuario
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

def listar_usuarios():
    return Usuario.query.order_by(Usuario.id_usuario.asc()).all()

def obtener_usuario_por_id(id_usuario):
    return Usuario.query.get(id_usuario)

def crear_usuario(data):
    correo = data.get('correo')
    contraseña = data.get('contraseña')

    if not correo or not contraseña:
        return None, 'Correo y contraseña son obligatorios.'
    
    if Usuario.query.filter_by(correo=correo).first():
        return None, 'El correo ya está registrado.'
    hashed_password = generate_password_hash(contraseña)
    nuevo_usuario = Usuario(
        nombre=data['nombre'],
        correo=data['correo'],
        contraseña=hashed_password,
        rol_id=data['rol_id']
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return nuevo_usuario, None

def actualizar_usuario(id_usuario, data):
    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return None

    usuario.nombre = data.get('nombre', usuario.nombre)
    usuario.correo = data.get('correo', usuario.correo)
    usuario.rol_id = data.get('rol_id', usuario.rol_id)

    nueva_contraseña = data.get('contraseña')
    if nueva_contraseña:
        usuario.contraseña = generate_password_hash(nueva_contraseña)

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
