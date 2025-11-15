# backend/main.py

from flask import Flask, jsonify
from flask_migrate import Migrate
from extensions import db, migrate
from routes.posts import posts_bp
from config import Config
from models.user import User  
from models.post import Post  
from routes.auth import auth_bp
from routes.users import users_bp




app = Flask(__name__)
app.config.from_object(Config)

# Initialize the database and migrations correctly
db.init_app(app)
migrate.init_app(app, db)

# Register your routes
app.register_blueprint(posts_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)

@app.route("/")
def home():
    return jsonify({"message": "Thoughts Out Loud API is running!"})

if __name__ == "__main__":
    app.run(debug=True)
