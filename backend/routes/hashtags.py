# backend/routes/hashtags.py
# PURPOSE: Allow fetching posts by hashtag name (simplified).
# BEGINNER: When a post contains #word we store that word in a hashtags table.
# This file lets the frontend ask: "Give me all posts for #word".

from flask import Blueprint, jsonify
from extensions import db
from models.hashtag import Hashtag
from models.post import Post
from models.post_hashtag import post_hashtags

hashtags_bp = Blueprint("hashtags", __name__, url_prefix="/hashtags")

@hashtags_bp.route("/<string:name>", methods=["GET"])
def posts_for_hashtag(name):
    tag = Hashtag.query.filter(db.func.lower(Hashtag.name) == name.lower()).first()
    if not tag:
        return jsonify([]), 200
    # join posts via association table
    post_rows = db.session.execute(
        db.select(Post).join(post_hashtags, Post.id == post_hashtags.c.post_id)
        .where(post_hashtags.c.hashtag_id == tag.id)
        .order_by(Post.created_at.desc())
    ).scalars().all()
    return jsonify([p.to_dict() for p in post_rows]), 200
