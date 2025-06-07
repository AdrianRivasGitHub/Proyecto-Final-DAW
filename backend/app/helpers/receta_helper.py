def hay_duplicados_por_clave(lista, clave):
    # Extraer los IDs en una lista
    valores = [item[clave] for item in lista]
    # Compara el total de ids con la cantidad de ids únicos para determinar si hay repetidos
    return len(valores) != len(set(valores))

# Validar datos de tablas intermedias repetidos
def validar_datos_receta(data):
    errores = []

    ingredientes_list = data.get("ingredientes", [])
    if ingredientes_list and hay_duplicados_por_clave(ingredientes_list, "ingrediente_id"):
        errores.append("No se permiten ingredientes duplicados.")

    subcategorias_ids = data.get("subcategorias", [])
    if subcategorias_ids and (len(subcategorias_ids) != len(set(subcategorias_ids))): # Comprueba duplicados en la lista de IDs directamente
        errores.append("No se permiten subcategorías duplicadas.")

    # Si hay errores los lanza
    if errores:
        raise ValueError(" ".join(errores))
