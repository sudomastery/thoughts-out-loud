# backend/config.py

import os

class Config:
    # Connect to PostgreSQL database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:Maina@localhost:5432/thoughts_db"  
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
