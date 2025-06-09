import pytest
from app import create_app, db as _db
from app.models import Rol

@pytest.fixture(scope='session')
def app():
    """Crea una instancia de la aplicación Flask para toda la sesión de pruebas."""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-jwt",
        "WTF_CSRF_ENABLED": False,
        "SERVER_NAME": "localhost.localdomain"
    })

    with app.app_context():
        _db.create_all() # Crea todas las tablas

        if not Rol.query.filter_by(id_rol=1).first():
            _db.session.add(Rol(id_rol=1, nombre_rol='Admin', descripcion='Administrador del sistema'))
        if not Rol.query.filter_by(id_rol=2).first():
            _db.session.add(Rol(id_rol=2, nombre_rol='Moderador', descripcion='Moderador de contenido'))
        if not Rol.query.filter_by(id_rol=3).first():
            _db.session.add(Rol(id_rol=3, nombre_rol='Usuario', descripcion='Usuario regular'))
        _db.session.commit()

    yield app

    with app.app_context():
        _db.session.remove()
        _db.drop_all() # Limpia la base de datos después de las pruebas

@pytest.fixture()
def client(app):
    """Un cliente de prueba para la aplicación."""
    return app.test_client()

@pytest.fixture()
def runner(app):
    """Un runner para comandos CLI de Flask."""
    return app.test_cli_runner()

@pytest.fixture()
def db(app):
    """Fixture para interactuar con la base de datos directamente en las pruebas si es necesario."""
    with app.app_context():
        yield _db