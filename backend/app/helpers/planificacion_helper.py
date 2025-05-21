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
