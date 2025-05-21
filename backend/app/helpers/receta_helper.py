def hay_duplicados_por_clave(lista, clave):
    # Extraer los IDs en una lista
    valores = [item[clave] for item in lista]
    # Compara el total de ids con la cantidad de ids únicos para determinar si hay repetidos
    return len(valores) != len(set(valores))

# Validar datos de tablas intermedias repetidos
def validar_datos_receta(data):
    errores = []

    if hay_duplicados_por_clave(data.get("ingredientes", []), "ingrediente_id"):
        errores.append("No se permiten ingredientes duplicados.")
    
    if hay_duplicados_por_clave(data.get("alergenos", []), "alergeno_id"):
        errores.append("No se permiten alérgenos duplicados.")
    
    if hay_duplicados_por_clave(data.get("subcategorias", []), "subcategoria_id"):
        errores.append("No se permiten subcategorías duplicadas.")

    # Si hay errores los lanza
    if errores:
        raise ValueError(" ".join(errores))
