from app.models.recetas import Receta
from app import db
from datetime import datetime, timezone

#Docstrings para las funciones de servicio de recetas

def listar_recetas():
    """
    Devuelve todas las recetas de la base de datos.
    """
    return Receta.query.order_by(Receta.created_at.desc()).all()


def buscar_recetas(nombre):
    """
    Busca recetas por nombre parcial o completo
    """
    return Receta.query.filter(
        Receta.nombre.ilike(f'%{nombre}%')
    ).order_by(Receta.created_at.desc()).all()


def obtener_receta_por_id(id_receta):
    """
    Busca una receta por su ID.
    """
    return Receta.query.get(id_receta)

def crear_receta(data):
    nueva_receta = Receta(
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        preparacion=data.get('preparacion'),
        imagen_url=data.get('imagen_url'),
        categoria_id=data['categoria_id'],
        region_id=data['region_id'],
        usuario_id=data['usuario_id'],
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.session.add(nueva_receta)
    db.session.commit()
    return nueva_receta
