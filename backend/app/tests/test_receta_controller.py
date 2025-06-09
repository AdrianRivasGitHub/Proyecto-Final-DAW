# import json
# from app.models import Receta, Categoria, Region, Usuario, Ingrediente, Subcategoria, Rol
# from app import db

# def setup_initial_data(app):
#     """Helper para crear datos iniciales para las pruebas de recetas."""
#     with app.app_context():
#         user_rol = Rol.query.filter_by(id_rol=3).first()
#         if not user_rol:
#             user_rol = Rol(id_rol=3, nombre_rol='Usuario')
#             db.session.add(user_rol)

#         categoria = Categoria.query.filter_by(nombre='Postres Test').first()
#         if not categoria:
#             categoria = Categoria(nombre='Postres Test')
#             db.session.add(categoria)

#         region = Region.query.filter_by(nombre='Costa Test').first()
#         if not region:
#             region = Region(nombre='Costa Test')
#             db.session.add(region)

#         usuario = Usuario.query.filter_by(correo='recipeuser@example.com').first()
#         if not usuario:
#             usuario = Usuario(nombre='Recipe User', correo='recipeuser@example.com', contraseña='hashedpassword', rol_id=3)
#             db.session.add(usuario)

#         ingrediente1 = Ingrediente.query.filter_by(nombre='Harina Test').first()
#         if not ingrediente1:
#             ingrediente1 = Ingrediente(nombre='Harina Test')
#             db.session.add(ingrediente1)
#         ingrediente2 = Ingrediente.query.filter_by(nombre='Azucar Test').first()
#         if not ingrediente2:
#             ingrediente2 = Ingrediente(nombre='Azucar Test')
#             db.session.add(ingrediente2)

#         subcategoria = Subcategoria.query.filter_by(nombre='Dulces Test').first()
#         if not subcategoria:
#             subcategoria = Subcategoria(nombre='Dulces Test')
#             db.session.add(subcategoria)
#         db.session.commit()
#         # Devuelve tanto los objetos como los IDs
#         return (
#             categoria, region, usuario, ingrediente1, ingrediente2, subcategoria,
#             categoria.id_categoria, region.id_region, usuario.id_usuario, ingrediente1.id_ingrediente, ingrediente2.id_ingrediente, subcategoria.id_subcategoria
#         )

# def test_obtener_recetas_vacio(client, app):
#     """Prueba obtener recetas cuando no hay ninguna."""
#     response = client.get('/api/recetas/')
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert isinstance(data, list)
#     assert len(data) == 0

# def test_crear_receta_exitoso(client, app):
#     """Prueba crear una nueva receta exitosamente (sin imagen por simplicidad)."""
#     categoria, region, usuario, ingrediente1, ingrediente2, subcategoria, categoria_id, region_id, usuario_id, ing1_id, ing2_id, subcat_id = setup_initial_data(app)
#     receta_data = {
#         'nombre': 'Torta de Chocolate Test',
#         'descripcion': 'Deliciosa torta de chocolate.',
#         'preparacion': 'Mezclar todo y hornear.',
#         'categoria_id': categoria_id,
#         'region_id': region_id,
#         'usuario_id': usuario_id,
#         'dificultad': 'Fácil',
#         'tiempo': 30,
#         'rating': 4.5,
#         'ingredientes': [
#             {'ingrediente_id': ing1_id, 'cantidad': '200', 'unidad': 'gr'},
#             {'ingrediente_id': ing2_id, 'cantidad': '100', 'unidad': 'gr'}
#         ],
#         'subcategorias': [subcat_id]
#     }
#     response = client.post('/api/recetas/', json=receta_data)
#     assert response.status_code == 201
#     data = json.loads(response.data)
#     assert data['nombre'] == 'Torta de Chocolate Test'
#     assert data['categoria']['nombre'] == categoria.nombre
#     assert data['region']['nombre'] == region.nombre
#     assert len(data['ingredientes_receta']) == 2
#     assert len(data['subcategorias_receta']) == 1
#     with app.app_context():
#         receta_db = Receta.query.filter_by(nombre='Torta de Chocolate Test').first()
#         assert receta_db is not None
#         assert len(receta_db.ingredientes_receta) == 2
#         assert len(receta_db.subcategorias_receta) == 1

# def test_obtener_recetas_con_datos(client, app):
#     """Prueba obtener recetas después de crear una."""
#     categoria, region, usuario, _, _, _, categoria_id, region_id, usuario_id, *_ = setup_initial_data(app)
#     with app.app_context():
#         receta = Receta(nombre='Receta Simple Test', preparacion='...', categoria_id=categoria_id, region_id=region_id, usuario_id=usuario_id)
#         db.session.add(receta)
#         db.session.commit()
#         receta_id = receta.id_receta
#     response = client.get('/api/recetas/')
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert len(data) > 0
#     assert any(r['nombre'] == 'Receta Simple Test' for r in data)
#     response_id = client.get(f'/api/recetas/{receta_id}')
#     assert response_id.status_code == 200
#     data_id = json.loads(response_id.data)
#     assert data_id['nombre'] == 'Receta Simple Test'