from app.models.subcategorias import Subcategoria
from app import db

def obtener_subcategorias():
    return Subcategoria.query.order_by(Subcategoria.nombre.asc()).all()

def obtener_subcategoria_por_id(id_subcategoria):
    return Subcategoria.query.get(id_subcategoria)

def crear_subcategoria(data):
    nueva_subcategoria = Subcategoria(
        nombre=data['nombre'],
        descripcion=data.get('descripcion')
    )
    db.session.add(nueva_subcategoria)
    db.session.commit()
    return nueva_subcategoria

def actualizar_subcategoria(id_subcategoria, data):
    subcategoria = Subcategoria.query.get(id_subcategoria)
    if not subcategoria:
        return None
    
    subcategoria.nombre = data.get('nombre', subcategoria.nombre)
    subcategoria.descripcion = data.get('descripcion', subcategoria.descripcion)

    db.session.commit()
    return subcategoria

def eliminar_subcategoria(id_subcategoria):
    subcategoria = Subcategoria.query.get(id_subcategoria)
    if not subcategoria:
        return None
    
    db.session.delete(subcategoria)
    db.session.commit()
    return subcategoria
