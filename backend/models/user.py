from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from models.like import likes  # association table for likes

class User(db.Model):
    """User model (single authoritative definition).
    Fields match existing migrations: id, username, email, password.
    Added relationship 'liked_posts' for like feature.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # One-to-many: user -> posts
    posts = db.relationship("Post", backref="user", lazy=True)

    # Many-to-many: posts liked by user
    liked_posts = db.relationship(
        "Post",
        secondary=likes,
        backref=db.backref("liked_by", lazy="dynamic"),
        lazy="dynamic"
    )

    def set_password(self, raw_password: str):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password, raw_password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }

    def __repr__(self):  # debug convenience
        return f"<User {self.username}>"
