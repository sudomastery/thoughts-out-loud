from datetime import datetime
from . import db
from .post_hashtag import post_hashtags

class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Author relationship
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Hashtags relationship
    hashtags = db.relationship(
        'Hashtag',
        secondary=post_hashtags,
        backref=db.backref('posts', lazy='dynamic'),
        lazy='dynamic'
    )

    def __repr__(self):
        return f"<Post {self.id} by User {self.author_id}>"


