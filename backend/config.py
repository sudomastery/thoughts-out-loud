# backend/config.py

import os
from dotenv import load_dotenv

# Load variables from a .env file in the backend folder (if present)
load_dotenv()

class Config:
    # Connect to PostgreSQL database
    # Prefer environment variable, but default to your local DB so it's persistent without exporting each time.
    # Note: update credentials here if you change them in Postgres.
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://thoughts_user:9090@localhost:5432/thoughts_db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Secret used to sign JWTs (override in environment for security)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me")
