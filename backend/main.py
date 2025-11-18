# backend/main.py

from flask import Flask, jsonify
from flask_migrate import Migrate
from extensions import db, migrate
from config import Config

# Import Blueprints
from routes.posts import posts_bp
from routes.auth import auth_bp
from routes.users import users_bp
from routes.hashtag import hashtags_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize DB and migrations
db.init_app(app)
migrate.init_app(app, db)

# Register Blueprints
app.register_blueprint(posts_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(hashtags_bp)

@app.route("/")
def home():
    return jsonify({"message": "Thoughts Out Loud API is running!"})

if __name__ == "__main__":
    app.run(debug=True)
