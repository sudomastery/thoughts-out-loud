# models/__init__.py

# Import the single db instance from extensions
from extensions import db

# Import models AFTER db is imported to avoid circular imports
from .user import User
from .post import Post
from .hashtag import Hashtag

# Import association tables
from .follow import followers
from .like import likes
from .post_hashtag import post_hashtags
