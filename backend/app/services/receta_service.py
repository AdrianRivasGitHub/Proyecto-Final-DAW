from app.models.recetas import Receta
from app.models.receta_ingrediente import RecetaIngrediente
from app.models.receta_alergeno import RecetaAlergeno
from app.models.receta_subcategoria import RecetaSubcategoria
from app.helpers.receta_helper import validar_datos_receta
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
    validar_datos_receta(data)

    with db.session.begin():
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
        db.session.flush()

        # Ingredientes
        ingredientes_data = data['ingredientes']
        ingredientes = [
            RecetaIngrediente(
                receta_id=nueva_receta.id_receta,
                ingrediente_id=ing['ingrediente_id'],
                cantidad=ing['cantidad'],
                unidad=ing['unidad']
            )
            for ing in ingredientes_data
        ]
        # Mayor velocidad que con db.session.add_all(ingredientes)
        db.session.bulk_save_objects(ingredientes)

        # Alergenos
        alergenos_data = data.get('alergenos', [])
        alergenos = [
            RecetaAlergeno(
                receta_id=nueva_receta.id_receta,
                alergeno_id=alergeno["alergeno_id"]
            )
            for alergeno in alergenos_data
        ]
        db.session.bulk_save_objects(alergenos)

        # Subcategorías
        subcategorias_data = data.get('subcategorias', [])
        subcategorias = [
            RecetaSubcategoria(
                receta_id=nueva_receta.id_receta,
                subcategoria_id=sub["subcategoria_id"]
            )
            for sub in subcategorias_data
        ]
        db.session.bulk_save_objects(subcategorias)

    #db.session.commit()
    return nueva_receta

def actualizar_receta(id_receta, data):
    validar_datos_receta(data)

    receta = Receta.query.get(id_receta)
    if not receta:
        return None
    
    with db.session.begin():
        receta.nombre = data.get('nombre', receta.nombre)
        receta.descripcion = data.get('descripcion', receta.descripcion)
        receta.preparacion = data.get('preparacion', receta.preparacion)
        receta.imagen_url = data.get('imagen_url', receta.imagen_url)
        receta.categoria_id = data.get('categoria_id', receta.categoria_id)
        receta.region_id = data.get('region_id', receta.region_id)
        receta.updated_at = datetime.now(timezone.utc)
        
        # Limpiar registros anteriores
        db.session.query(RecetaIngrediente).filter_by(receta_id=id_receta).delete()
        db.session.query(RecetaAlergeno).filter_by(receta_id=id_receta).delete()
        db.session.query(RecetaSubcategoria).filter_by(receta_id=id_receta).delete()

        # Insertar nuevos ingredientes
        ingredientes_data = data.get('ingredientes', [])
        ingredientes = [
            RecetaIngrediente(
                receta_id=id_receta,
                ingrediente_id=ing['ingrediente_id'],
                cantidad=ing['cantidad'],
                unidad=ing['unidad']
            )
            for ing in ingredientes_data
        ]
        db.session.bulk_save_objects(ingredientes)

        # Alergenos
        alergenos_data = data.get('alergenos', [])
        alergenos = [
            RecetaAlergeno(
                receta_id=id_receta,
                alergeno_id=alergeno["alergeno_id"]
            )
            for alergeno in alergenos_data
        ]
        db.session.bulk_save_objects(alergenos)

        # Subcategorías
        subcategorias_data = data.get('subcategorias', [])
        subcategorias = [
            RecetaSubcategoria(
                receta_id=id_receta,
                subcategoria_id=sub["subcategoria_id"]
            )
            for sub in subcategorias_data
        ]
        db.session.bulk_save_objects(subcategorias)        
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
