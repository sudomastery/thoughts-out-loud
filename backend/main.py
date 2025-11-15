# backend/main.py

from flask import Flask, jsonify
from flask_migrate import Migrate
from extensions import db, migrate
from routes.posts import posts_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize the database and migrations correctly
db.init_app(app)
migrate.init_app(app, db)

# Register your routes
app.register_blueprint(posts_bp)

@app.route("/")
def home():
    return jsonify({"message": "Thoughts Out Loud API is running!"})

if __name__ == "__main__":
    app.run(debug=True)
