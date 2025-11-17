# models/__init__.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models AFTER db is created to avoid circular imports
from .user import User
from .post import Post
from .hashtag import Hashtag

# Import association tables
from .follow import followers
from .like import likes
from .post_hashtag import post_hashtags