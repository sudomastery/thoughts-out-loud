from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Keep all relationships but use string references
    posts = db.relationship("Post", backref="author", lazy=True)
    
    # Following/Followers (will work when follow model exists)
    following = db.relationship(
        'User',
        secondary='followers',  # Use string for table name
        primaryjoin=("User.id == followers.c.follower_id"),
        secondaryjoin=("User.id == followers.c.followed_id"),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )

    # Liked posts (will work when like model exists)
    liked_posts = db.relationship(
        'Post',
        secondary='likes',  # Use string for table name
        backref=db.backref('liked_by', lazy='dynamic'),
        lazy='dynamic'
    )

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<User {self.username}>"