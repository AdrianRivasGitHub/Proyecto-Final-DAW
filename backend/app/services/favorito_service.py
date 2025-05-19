from app import db
from app.models.favoritos import Favorito

def agregar_favorito(data):
    # Validar si ya existe el favorito
    favorito_existente = Favorito.query.filter_by(
        usuario_id=data['usuario_id'],
        receta_id=data['receta_id']
    ).first()

    if favorito_existente:
        return None

    nuevo_favorito = Favorito(
        usuario_id=data['usuario_id'],
        receta_id=data['receta_id'] 
    )
    db.session.add(nuevo_favorito)
    db.session.commit()
    return nuevo_favorito

def eliminar_favorito(id_favorito):
    favorito = Favorito.query.get(id_favorito)
    if not favorito:
        return None

    db.session.delete(favorito)
    db.session.commit()
    return favorito

def listar_favoritos_por_usuario(usuario_id):
    favoritos = Favorito.query.filter_by(usuario_id=usuario_id).all()
    return favoritos
