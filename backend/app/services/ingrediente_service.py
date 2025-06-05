from app import db
from app.models.ingredientes import Ingrediente

def listar_ingredientes():
    return Ingrediente.query.order_by(Ingrediente.id_ingrediente.asc()).all()

def obtener_ingrediente_por_id(id_ingrediente):
    return Ingrediente.query.get(id_ingrediente)

def crear_ingrediente(data):
    nuevo_ingrediente = Ingrediente(
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        alergeno_id=data.get('alergeno_id')
    )
    db.session.add(nuevo_ingrediente)
    db.session.commit()
    return nuevo_ingrediente

def actualizar_ingrediente(id_ingrediente, data):
    ingrediente = Ingrediente.query.get(id_ingrediente)
    if not ingrediente:
        return None
    
    ingrediente.nombre = data['nombre']
    ingrediente.descripcion = data.get('descripcion')
    ingrediente.alergeno_id = data.get('alergeno_id')

    db.session.commit()
    return ingrediente

def eliminar_ingrediente(id_ingrediente):
    ingrediente = Ingrediente.query.get(id_ingrediente)
    if not ingrediente:
        return None
    
    db.session.delete(ingrediente)
    db.session.commit()
    return ingrediente
