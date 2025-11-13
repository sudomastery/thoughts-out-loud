# backend/models/user.py

# Import the database instance
from extensions import db

# Define a simple User model to link with Post
class User(db.Model):
    __tablename__ = "users"  # Table name in the database

    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each user
    username = db.Column(db.String(80), unique=True, nullable=False)  # Username for the user

    # Relationship to posts — allows us to access all posts by a user
    posts = db.relationship("Post", backref="user", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
        }
