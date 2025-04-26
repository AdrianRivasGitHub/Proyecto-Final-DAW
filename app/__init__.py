from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    load_dotenv()   #Cargar variables de entorno desde el archivo .env

    app = Flask(__name__)
    app.config.from_object('app.config.Config')     #Cargar la configuración desde el archivo config.py

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    #Registro de rutas
    from app.routes.recetas import recetas_bp
    app.register_blueprint(recetas_bp, url_prefix="/api/recetas")

    return app
