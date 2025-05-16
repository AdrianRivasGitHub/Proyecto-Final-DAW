from app.models.recetas import Receta
from app import db
from datetime import datetime, timezone

#Docstrings para las funciones de servicio de recetas

def listar_recetas():
    """
    Lista todas las recetas ordenadas por fecha de creación
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

def actualizar_receta(id_receta, data):
    receta = Receta.query.get(id_receta)
    if not receta:
        return None

    receta.nombre = data.get('nombre', receta.nombre)
    receta.descripcion = data.get('descripcion', receta.descripcion)
    receta.preparacion = data.get('preparacion', receta.preparacion)
    receta.imagen_url = data.get('imagen_url', receta.imagen_url)
    receta.categoria_id = data.get('categoria_id', receta.categoria_id)
    receta.region_id = data.get('region_id', receta.region_id)
    receta.updated_at = datetime.now(timezone.utc)

    db.session.commit()
    return receta

def eliminar_receta(id_receta):
    receta = Receta.query.get(id_receta)
    if not receta:
        return None
    
    db.session.delete(receta)
    db.session.commit()
    return receta

def listar_recetas_por_categoria(categoria_id):
    return Receta.query.filter_by(categoria_id=categoria_id).order_by(Receta.created_at.desc()).all()

def listar_recetas_por_region(region_id):
    return Receta.query.filter_by(region_id=region_id).order_by(Receta.created_at.desc()).all()
