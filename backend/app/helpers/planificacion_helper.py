from datetime import datetime

# Valida que no existan combinaciones duplicadas de (dia, categoria_id) en las recetas de la planificación
def validar_recetas_planificacion(recetas_data):
    # Se crea un set para guardar las tuplas únicas (día, categoria_id) mientras se recorren las recetas
    combinaciones = set()
    for receta in recetas_data:
        clave = (receta['dia'], receta['categoria_id'])
        if clave in combinaciones:
            # Lanza ValueError si se intenta añadir una combinación ya existente
            raise ValueError('No se permiten recetas duplicadas para el mismo día y categoría.')
        combinaciones.add(clave)

def validar_fechas_planificacion(fecha_inicio, fecha_fin):
    """
    Valida que la fecha de inicio sea posterior a la fecha actual
    y que la fecha de fin sea posterior a la fecha de inicio.
    Lanza ValueError si no se cumple.
    """
    ahora = datetime.now().date()
    if isinstance(fecha_inicio, str):
        fecha_inicio = datetime.fromisoformat(fecha_inicio).date()
    if isinstance(fecha_fin, str):
        fecha_fin = datetime.fromisoformat(fecha_fin).date()
    if fecha_inicio <= ahora:
        raise ValueError('La fecha de inicio debe ser posterior a la fecha actual.')
    if fecha_fin <= fecha_inicio:
        raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio.')
