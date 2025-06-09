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
    return Receta.query.order_by(Receta.created_at.asc()).all()

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
    #print("DEBUG [crear_receta]: Llamando a validar_datos_receta.")
    validar_datos_receta(data)
    #print("DEBUG [crear_receta]: validar_datos_receta completado.")
    with db.session.begin():
        nueva_receta = Receta(
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            preparacion=data.get('preparacion'),
            imagen_url=data.get('imagen_url'),
            categoria_id=int(data['categoria_id']),
            region_id=int(data['region_id']),
            usuario_id=int(data['usuario_id']),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            dificultad=data.get('dificultad'),
            tiempo=data.get('tiempo'),
            rating=data.get('rating')
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

        # Obtener alérgenos únicos de los ingredientes
        from app.models.ingredientes import Ingrediente
        ingrediente_ids = [ing['ingrediente_id'] for ing in ingredientes_data]
        ingredientes_objs = Ingrediente.query.filter(Ingrediente.id_ingrediente.in_(ingrediente_ids)).all()
        alergeno_ids = set(
            ing.alergeno_id for ing in ingredientes_objs if ing.alergeno_id is not None
        )

        # Alergenos
        alergenos = [
            RecetaAlergeno(
                receta_id=nueva_receta.id_receta,
                alergeno_id=alergeno_id
            )
            for alergeno_id in alergeno_ids
        ]
        db.session.bulk_save_objects(alergenos)

        # Subcategorías
        subcategorias_data = data.get('subcategorias', [])
        subcategorias = [
            RecetaSubcategoria(
                receta_id=nueva_receta.id_receta,
                subcategoria_id=sub_id
            )
            for sub_id in subcategorias_data
        ]
        try:
            db.session.bulk_save_objects(subcategorias)
        except Exception as e:
            #print("Error al guardar subcategorias:", e)
            raise

    #db.session.commit()
    return nueva_receta

def actualizar_receta(id_receta, data):
    #print("DEBUG [actualizar_receta]: Llamando a validar_datos_receta.")
    validar_datos_receta(data)
    #print("DEBUG [actualizar_receta]: validar_datos_receta completado.")

    receta = Receta.query.get(id_receta)
    if not receta:
        return None
    
    receta.nombre = data.get('nombre', receta.nombre)
    receta.descripcion = data.get('descripcion', receta.descripcion)
    receta.preparacion = data.get('preparacion', receta.preparacion)
    receta.imagen_url = data.get('imagen_url', receta.imagen_url)
    receta.categoria_id = int(data.get('categoria_id', receta.categoria_id))
    receta.region_id = int(data.get('region_id', receta.region_id))
    receta.usuario_id = int(data.get('usuario_id', receta.usuario_id))
    receta.updated_at = datetime.now(timezone.utc)
    receta.dificultad = data.get('dificultad', receta.dificultad)
    receta.tiempo = data.get('tiempo', receta.tiempo)
    receta.rating = data.get('rating', receta.rating)
    
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

    # Obtener alérgenos únicos de los ingredientes
    from app.models.ingredientes import Ingrediente
    ingrediente_ids = [ing['ingrediente_id'] for ing in ingredientes_data]
    ingredientes_objs = Ingrediente.query.filter(Ingrediente.id_ingrediente.in_(ingrediente_ids)).all()
    alergeno_ids = set(
        ing.alergeno_id for ing in ingredientes_objs if ing.alergeno_id is not None
    )

    # Alergenos
    alergenos = [
        RecetaAlergeno(
            receta_id=id_receta,
            alergeno_id=alergeno_id
        )
        for alergeno_id in alergeno_ids
    ]
    db.session.bulk_save_objects(alergenos)

    # Subcategorías
    subcategorias_data = data.get('subcategorias', [])
    subcategorias = [
        RecetaSubcategoria(
            receta_id=id_receta,
            subcategoria_id=sub
        )
        for sub in subcategorias_data
    ]
    db.session.bulk_save_objects(subcategorias)
    
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
