from flask_sqlalchemy import SQLAlchemy

# Single db instance for the whole app
db = SQLAlchemy()

# Import all models so they are registered with SQLAlchemy
from .user import User
from .post import Post
from .hashtag import Hashtag
from .follow import followers
from .like import likes
from .post_hashtag import post_hashtags
