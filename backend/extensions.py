# backend/extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# Initialize database and migration objects
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
