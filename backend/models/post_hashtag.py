# backend/models/post_hashtag.py

from extensions import db

# Association table for many-to-many relationship between posts and hashtags
post_hashtags = db.Table(
    "post_hashtags",
    db.Column("post_id", db.Integer, db.ForeignKey("posts.id"), primary_key=True),
    db.Column("hashtag_id", db.Integer, db.ForeignKey("hashtags.id"), primary_key=True)
)
