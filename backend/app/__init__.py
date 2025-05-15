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
    CORS(app)

    #Registro de rutas
    from app.routes.usuarios import usuarios_bp
    app.register_blueprint(usuarios_bp, url_prefix="/api/usuarios")
    
    from app.routes.recetas import recetas_bp
    app.register_blueprint(recetas_bp, url_prefix="/api/recetas")

    return app
