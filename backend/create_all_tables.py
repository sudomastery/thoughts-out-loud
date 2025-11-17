# backend/proper_db_setup.py
from main import app
from extensions import db

def setup_database():
    with app.app_context():
        print("🚀 Setting up database with SQLAlchemy...")
        
        # Drop all tables
        db.drop_all()
        print("✅ Dropped existing tables")
        
        # Create all tables using SQLAlchemy
        db.create_all()
        print("✅ Created tables using SQLAlchemy ORM")
        
        # Verify using SQLAlchemy inspection
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        print("📊 Tables created by SQLAlchemy:")
        for table in tables:
            print(f"   - {table}")
        
        return tables

if __name__ == "__main__":
    tables = setup_database()