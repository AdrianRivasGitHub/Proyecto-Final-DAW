from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

#Extensiones
db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
jwt = JWTManager()

from app import models

def create_app():
    load_dotenv()   #Cargar variables de entorno desde el archivo .env

    app = Flask(__name__)
    app.config.from_object('app.config.Config')     #Cargar la configuración desde el archivo config.py

    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    #CORS(app, origins=[app.config["FRONTEND_URL"]], supports_credentials=True)

    frontend_urls_str = app.config.get("FRONTEND_URL", "")
    frontend_urls_list = [url.strip() for url in frontend_urls_str.split(',') if url.strip()] # Convertir a lista
    CORS(app, origins=frontend_urls_list, supports_credentials=True)

    #Registro de rutas
    from app.routes.alergenos_routes import alergenos_bp
    app.register_blueprint(alergenos_bp, url_prefix="/api/alergenos/", strict_slashes=False)

    from app.routes.categorias_routes import categorias_bp
    app.register_blueprint(categorias_bp, url_prefix="/api/categorias/", strict_slashes=False)

    from app.routes.favoritos_routes import favoritos_bp
    app.register_blueprint(favoritos_bp, url_prefix="/api/favoritos/", strict_slashes=False)

    from app.routes.ingredientes_routes import ingredientes_bp
    app.register_blueprint(ingredientes_bp, url_prefix="/api/ingredientes/", strict_slashes=False)

    from app.routes.planificaciones_routes import planificaciones_bp
    app.register_blueprint(planificaciones_bp, url_prefix='/api/planificaciones/', strict_slashes=False)

    from app.routes.recetas_routes import recetas_bp
    app.register_blueprint(recetas_bp, url_prefix="/api/recetas/", strict_slashes=False)

    from app.routes.regiones_routes import regiones_bp
    app.register_blueprint(regiones_bp, url_prefix="/api/regiones/", strict_slashes=False)

    from app.routes.subcategorias_routes import subcategorias_bp
    app.register_blueprint(subcategorias_bp, url_prefix="/api/subcategorias/", strict_slashes=False)

    from app.routes.usuarios_routes import usuarios_bp
    app.register_blueprint(usuarios_bp, url_prefix="/api/usuarios/", strict_slashes=False)

    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth/", strict_slashes=False)

    return app
