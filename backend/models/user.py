from extensions import db  # Import from extensions, not models
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Use string references for relationships to avoid circular imports
    posts = db.relationship("Post", backref="author", lazy=True)
    
    following = db.relationship(
        'User', 
        secondary='followers',
        primaryjoin='User.id == followers.c.follower_id',
        secondaryjoin='User.id == followers.c.followed_id', 
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )

    liked_posts = db.relationship(
        'Post',
        secondary='likes',
        backref=db.backref('liked_by', lazy='dynamic'),
        lazy='dynamic'
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }