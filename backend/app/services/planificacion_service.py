from app import db
from app.models.planificaciones import Planificacion
from app.models.planificacion_receta import PlanificacionReceta
from app.helpers.planificacion_helper import validar_recetas_planificacion

def crear_planificacion(data):
    recetas_data = data.get('recetas', [])
    validar_recetas_planificacion(recetas_data)

    with db.session.begin():
        nueva_planificacion = Planificacion(
            usuario_id=data['usuario_id'],
            nombre=data['nombre'],
            fecha_inicio=data['fecha_inicio'],
            fecha_fin=data['fecha_fin']
        )
        db.session.add(nueva_planificacion)
        db.session.flush()

        for receta in recetas_data:
            nueva_relacion = PlanificacionReceta(
                planificacion_id=nueva_planificacion.id_planificacion,
                receta_id=receta['receta_id'],
                categoria_id=receta['categoria_id'],
                dia=receta['dia']
            )
            db.session.add(nueva_relacion)

    return nueva_planificacion


def listar_planificaciones_por_usuario(usuario_id):
    planificaciones = Planificacion.query.filter_by(usuario_id=usuario_id).all()
    return planificaciones

def obtener_planificacion(id_planificacion):
    return Planificacion.query.get(id_planificacion)

def actualizar_planificacion(id_planificacion, data):
    planificacion = Planificacion.query.get(id_planificacion)
    if not planificacion:
        return None

    recetas_data = data.get('recetas', [])
    validar_recetas_planificacion(recetas_data)

    with db.session.begin():
        planificacion.nombre = data.get('nombre', planificacion.nombre)
        planificacion.fecha_inicio = data.get('fecha_inicio', planificacion.fecha_inicio)
        planificacion.fecha_fin = data.get('fecha_fin', planificacion.fecha_fin)

        # Eliminar relaciones antiguas
        PlanificacionReceta.query.filter_by(planificacion_id=planificacion.id_planificacion).delete()

        # Agregar nuevas relaciones
        for receta in recetas_data:
            nueva_relacion = PlanificacionReceta(
                planificacion_id=planificacion.id_planificacion,
                receta_id=receta['receta_id'],
                categoria_id=receta['categoria_id'],
                dia=receta['dia']
            )
            db.session.add(nueva_relacion)

    return planificacion

def eliminar_planificacion(id_planificacion):
    planificacion = Planificacion.query.get(id_planificacion)
    if not planificacion:
        return None

    db.session.delete(planificacion)
    db.session.commit()
    return planificacion
