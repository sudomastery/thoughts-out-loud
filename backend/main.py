# backend/main.py

from flask import Flask, jsonify
from flask_migrate import Migrate
<<<<<<< HEAD
from flask_cors import CORS  # Enable cross-origin requests so the React app can call the API
from extensions import db, migrate, jwt
from routes.posts import posts_bp
from config import Config
from models.user import User  
from models.post import Post  
=======
from extensions import db, migrate
from config import Config

# Import models so Alembic sees them
from models.user import User
from models.post import Post
>>>>>>> seth-backend
from models.hashtag import Hashtag
from models.follow import followers
from models.like import likes
from models.post_hashtag import post_hashtags
<<<<<<< HEAD
from models.comment import Comment
from routes.auth import auth_bp
from routes.users import users_bp
from routes.hashtags import hashtags_bp
from routes.comments import comments_bp



=======


# Import Blueprints
from routes.posts import posts_bp
from routes.auth import auth_bp
from routes.users import users_bp
from routes.hashtag import hashtags_bp
>>>>>>> seth-backend

app = Flask(__name__)
app.config.from_object(Config)

<<<<<<< HEAD
# Allow the frontend (e.g. http://localhost:5173) to access the API.
# For learning we leave origins open; tighten later to specific domains.
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

# Initialize the database and migrations correctly
=======
# Initialize DB and migrations
>>>>>>> seth-backend
db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)

<<<<<<< HEAD
# Register the routes
=======
# Register Blueprints
>>>>>>> seth-backend
app.register_blueprint(posts_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(hashtags_bp)
<<<<<<< HEAD
app.register_blueprint(comments_bp)
=======
>>>>>>> seth-backend

@app.route("/")
def home():
    return jsonify({"message": "The API is running"})

if __name__ == "__main__":
    app.run(debug=True)
