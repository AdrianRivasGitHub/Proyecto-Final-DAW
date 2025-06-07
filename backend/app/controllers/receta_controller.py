from flask import jsonify, request, current_app
from werkzeug.utils import secure_filename
import os
from app.schemas.receta_schema import RecetaSchema
from app.services.receta_service import (
    crear_receta,
    listar_recetas,
    buscar_recetas,
    obtener_receta_por_id,
    actualizar_receta,
    eliminar_receta,
    listar_recetas_por_categoria, 
    listar_recetas_por_region
)

receta_schema = RecetaSchema()
recetas_schema = RecetaSchema(many=True)

def obtener_recetas_controller():
    """
    Maneja GET /api/recetas y /api/recetas?nombre=
    """
    nombre = request.args.get('nombre')

    if nombre:
        recetas = buscar_recetas(nombre)
    else:
        recetas = listar_recetas()

    resultado = recetas_schema.dump(recetas)
    return jsonify(resultado), 200

def obtener_receta_por_id_controller(id_receta):
    receta = obtener_receta_por_id(id_receta)
    
    if receta is None:
        return jsonify({'Error': 'Receta no encontrada'}), 404

    resultado = receta_schema.dump(receta)
    return jsonify(resultado), 200

def listar_recetas_por_categoria_controller(categoria_id):
    recetas = listar_recetas_por_categoria(categoria_id)
    return jsonify(recetas_schema.dump(recetas)), 200

def listar_recetas_por_region_controller(region_id):
    recetas = listar_recetas_por_region(region_id)
    return jsonify(recetas_schema.dump(recetas)), 200

def crear_receta_controller():
    # Cambia a multipart/form-data para recibir archivos como imagenes
    if request.content_type and 'multipart/form-data' in request.content_type:
        data = request.form.to_dict()
        # Convertir campos que son listas de JSON string a lista
        import json
        for key in ['ingredientes', 'subcategorias']:
            if key in data and isinstance(data[key], str):
                try:
                    data[key] = json.loads(data[key])
                except Exception:
                    data[key] = []
        imagen = request.files.get('imagen')
        imagen_url = None
        if imagen:
            filename = secure_filename(imagen.filename)
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            filepath = os.path.join(upload_folder, filename)
            imagen.save(filepath)
            imagen_url = f'/static/uploads/{filename}'
        data['imagen_url'] = imagen_url
        #print("Subcategoriass recibidos:", data)
    else:
        data = request.get_json()

    # Eliminar campo eliminar_imagen antes de validar
    if 'eliminar_imagen' in data:
        del data['eliminar_imagen']

    errores = receta_schema.validate(data)

    if errores:
        return jsonify(errores), 400
    
    # Validamos que venga el array de ingrediente por lo menos
    ingredientes = data.get('ingredientes')
    if not ingredientes or not isinstance(ingredientes, list):
        return jsonify({"Error": "Debe enviar una lista de ingredientes para la receta"}), 400    

    # Creamos la receta con ingredientes, alergenos y subcategorias
    try:
        nueva_receta = crear_receta(data)
    except ValueError as ve:
        return jsonify({"Error": str(ve)}), 400
    except Exception as e:
        return jsonify({"Error": str(e)}), 500
    
    resultado = receta_schema.dump(nueva_receta)
    return jsonify(resultado), 201

def actualizar_receta_controller(id_receta):
    # Cambia a multipart/form-data para recibir archivos como imagenes
    if request.content_type and 'multipart/form-data' in request.content_type:
        data = request.form.to_dict()
        import json
        for key in ['ingredientes', 'subcategorias']:
            if key in data and isinstance(data[key], str):
                try:
                    data[key] = json.loads(data[key])
                except Exception:
                    data[key] = []
        imagen = request.files.get('imagen')
        eliminar_imagen = data.get('eliminar_imagen') == 'true'
        imagen_url = None
        if imagen:
            filename = secure_filename(imagen.filename)
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            filepath = os.path.join(upload_folder, filename)
            imagen.save(filepath)
            imagen_url = f'/static/uploads/{filename}'
            data['imagen_url'] = imagen_url
        elif eliminar_imagen:
            data['imagen_url'] = None
        #print("Subcategoriass recibidos:", data)            
        # Si no hay imagen nueva ni se elimina, no se modifica imagen_url
    else:
        data = request.get_json()

    # Eliminar campo eliminar_imagen antes de validar
    if 'eliminar_imagen' in data:
        del data['eliminar_imagen']

    errores = receta_schema.validate(data, partial=True)
    if errores:
        return jsonify(errores), 400
    try:
        receta_actualizada = actualizar_receta(id_receta, data)
    except ValueError as ve:
        return jsonify({"Error": str(ve)}), 400
    except Exception as e:
        return jsonify({"Error": str(e)}), 500    
    if not receta_actualizada:
        return jsonify({'Error': 'Receta no encontrada'}), 404
    return jsonify(receta_schema.dump(receta_actualizada)), 200
    
def eliminar_receta_controller(id_receta):
    receta_eliminada = eliminar_receta(id_receta)
    if not receta_eliminada:
        return jsonify({'Error': 'Receta no encontrada'}), 404
    return jsonify({'Mensaje': 'Receta eliminada correctamente'}), 204
