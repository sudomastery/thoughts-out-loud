from datetime import datetime
from extensions import db


class Post(db.Model):
    __tablename__ = "posts"  

    # Columns = fields in the table
    id = db.Column(db.Integer, primary_key=True)  
    content = db.Column(db.Text, nullable=False)  
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  
    edited = db.Column(db.Boolean, default=False, nullable=False)  
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False) 

    # Helper method to make it easy to return posts as JSON
    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "user_id": self.user_id,
            "username": getattr(self.user, 'username', None),
            "replies_count": getattr(self, 'comments', None).count() if hasattr(self, 'comments') else 0,
            "likes_count": self._likes_count(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "edited": self.edited,
            # edited/updated_at removed in revert
        }

    def _likes_count(self):
        try:
            from models.like import likes
            return db.session.execute(
                db.select(db.func.count()).select_from(likes).where(likes.c.post_id == self.id)
            ).scalar()
        except Exception:
            return 0
