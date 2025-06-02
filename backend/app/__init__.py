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
    CORS(app, origins="http://localhost:5173")

    #Registro de rutas
    from app.routes.alergenos_routes import alergenos_bp
    app.register_blueprint(alergenos_bp, url_prefix="/api/alergenos")

    from app.routes.categorias_routes import categorias_bp
    app.register_blueprint(categorias_bp, url_prefix="/api/categorias")

    from app.routes.favoritos_routes import favoritos_bp
    app.register_blueprint(favoritos_bp, url_prefix="/api/favoritos")

    from app.routes.ingredientes_routes import ingredientes_bp
    app.register_blueprint(ingredientes_bp, url_prefix="/api/ingredientes")

    from app.routes.planificaciones_routes import planificaciones_bp
    app.register_blueprint(planificaciones_bp, url_prefix='/api/planificaciones')

    from app.routes.recetas_routes import recetas_bp
    app.register_blueprint(recetas_bp, url_prefix="/api/recetas")

    from app.routes.regiones_routes import regiones_bp
    app.register_blueprint(regiones_bp, url_prefix="/api/regiones")

    from app.routes.subcategorias_routes import subcategorias_bp
    app.register_blueprint(subcategorias_bp, url_prefix="/api/subcategorias")

    from app.routes.usuarios_routes import usuarios_bp
    app.register_blueprint(usuarios_bp, url_prefix="/api/usuarios")

    return app
