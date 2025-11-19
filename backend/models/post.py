from datetime import datetime
from extensions import db
from models.post_hashtag import post_hashtags  # Import the association table

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Many-to-many: A post can have many hashtags
    hashtags = db.relationship(
        "Hashtag",
        secondary=post_hashtags,
        backref=db.backref("posts", lazy="dynamic")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "hashtags": [h.to_dict() for h in self.hashtags]  # Include hashtags
        }
