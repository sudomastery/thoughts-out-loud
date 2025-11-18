# backend/main.py

from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS  # Enable cross-origin requests so the React app can call the API
from extensions import db, migrate, jwt
from routes.posts import posts_bp
from config import Config
from models.user import User  
from models.post import Post  
from models.hashtag import Hashtag
from models.follow import followers
from models.like import likes
from models.post_hashtag import post_hashtags
from models.comment import Comment
from routes.auth import auth_bp
from routes.users import users_bp
from routes.hashtags import hashtags_bp
from routes.comments import comments_bp




app = Flask(__name__)
app.config.from_object(Config)

# Allow the frontend (e.g. http://localhost:5173) to access the API.
# For learning we leave origins open; tighten later to specific domains.
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

# Initialize the database and migrations correctly
db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)

# Register the routes
app.register_blueprint(posts_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(hashtags_bp)
app.register_blueprint(comments_bp)

@app.route("/")
def home():
    return jsonify({"message": "The API is running"})

if __name__ == "__main__":
    app.run(debug=True)
