from datetime import datetime
from . import db
from .follow import followers
from .like import likes

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Posts authored by the user
    posts = db.relationship('Post', backref='author', lazy=True)

    # Following / Followers relationships
    following = db.relationship(
        'User',
        secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )

    # Liked posts
    liked_posts = db.relationship(
        'Post',
        secondary=likes,
        backref=db.backref('liked_by', lazy='dynamic'),
        lazy='dynamic'
    )

    def __repr__(self):
        return f"<User {self.username}>"
