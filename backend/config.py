# backend/config.py
import os

class Config:
    # Updated connection string
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://thoughts_user:9090@localhost:5432/thoughts_db" 
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False