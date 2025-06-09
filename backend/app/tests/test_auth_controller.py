# import json
# from app.models import Usuario, Rol
# from app import db

# def test_registro_exitoso(client, app):
#     """Prueba el registro de un nuevo usuario."""
#     response = client.post('/api/auth/registro', json={
#         'nombre': 'testuser',
#         'correo': 'test@example.com',
#         'contraseña': 'password123'
#         # rol_id por defecto es 3 (Usuario)
#     })
#     assert response.status_code == 201
#     data = json.loads(response.data)
#     assert 'access_token' in data
#     assert data['msg'] == 'Usuario registrado correctamente'
#     assert data['usuario']['nombre'] == 'testuser'
#     assert data['usuario']['correo'] == 'test@example.com'
#     assert data['usuario']['rol']['nombre_rol'] == 'Usuario'

# def test_registro_correo_existente(client, app):
#     """Prueba el registro con un correo que ya existe."""
#     client.post('/api/auth/registro', json={
#         'nombre': 'testuser1',
#         'correo': 'existente@example.com',
#         'contraseña': 'password123'
#     }) # Primer registro
#     response = client.post('/api/auth/registro', json={
#         'nombre': 'testuser2',
#         'correo': 'existente@example.com',
#         'contraseña': 'password456'
#     }) # Intento de segundo registro con el mismo correo
#     assert response.status_code == 400
#     data = json.loads(response.data)
#     assert data['msg'] == 'El correo ya está registrado.'

# def test_registro_datos_faltantes(client, app):
#     """Prueba el registro sin todos los datos obligatorios."""
#     response = client.post('/api/auth/registro', json={
#         'nombre': 'testuser'
#     })
#     assert response.status_code == 400
#     data = json.loads(response.data)
#     assert data['msg'] == 'Faltan datos obligatorios'

# def test_login_exitoso(client, app):
#     """Prueba el inicio de sesión exitoso."""
#     # Registrar un usuario
#     client.post('/api/auth/registro', json={
#         'nombre': 'loginuser',
#         'correo': 'login@example.com',
#         'contraseña': 'password123'
#     })
#     response = client.post('/api/auth/login', json={
#         'identificador': 'login@example.com',
#         'contraseña': 'password123'
#     })
#     assert response.status_code == 200
#     data = json.loads(response.data)
#     assert 'access_token' in data
#     assert data['usuario']['correo'] == 'login@example.com'

# def test_login_datos_incorrectos(client, app):
#     """Prueba el inicio de sesión con credenciales incorrectas."""
#     response = client.post('/api/auth/login', json={
#         'identificador': 'nouser@example.com',
#         'contraseña': 'nopassword'
#     })
#     assert response.status_code == 401
#     data = json.loads(response.data)
#     assert data['msg'] == 'Datos incorrectos'