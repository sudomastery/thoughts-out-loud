# backend/routes/users.py

from flask import Blueprint, jsonify, request
from extensions import db
from models.user import User
from models.post import Post
from models.like import likes
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

users_bp = Blueprint("users", __name__, url_prefix="/users")


# --------------- GET ALL USERS ---------------
@users_bp.route("", methods=["GET"])
def get_users():
    """List users. Optional search: /users?q=text matches username or email (case-insensitive)."""
    q = request.args.get('q', '').strip()
    query = User.query
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(
            db.func.lower(User.username).like(like) | db.func.lower(User.email).like(like)
        )
    users = query.order_by(User.username.asc()).all()
    return jsonify([u.to_dict() for u in users]), 200


# --------------- GET ONE USER ---------------
@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200


# --------------- GET ONE USER by username ---------------
@users_bp.route("/username/<string:username>", methods=["GET"])
def get_user_by_username(username):
    user = User.query.filter(db.func.lower(User.username) == username.lower()).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    # Aggregate basic stats
    posts_count = Post.query.filter_by(user_id=user.id).count()
    likes_given_count = db.session.execute(
        db.select(db.func.count()).select_from(likes).where(likes.c.user_id == user.id)
    ).scalar() or 0
    likes_received = db.session.execute(
        db.select(db.func.count()).select_from(likes)
        .join(Post, Post.id == likes.c.post_id)
        .where(Post.user_id == user.id)
    ).scalar() or 0
    data = user.to_dict()
    data["stats"] = {
        "posts_count": posts_count,
        "likes_given_count": likes_given_count,
        "likes_received": likes_received,
    }
    return jsonify(data), 200


# --------------- GET POSTS for a user by username ---------------
@users_bp.route("/username/<string:username>/posts", methods=["GET"])
def get_posts_for_user(username):
    user = User.query.filter(db.func.lower(User.username) == username.lower()).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    current_user_id = None
    try:
        verify_jwt_in_request()
        current_user_id = int(get_jwt_identity())
    except Exception:
        current_user_id = None
    posts = Post.query.filter_by(user_id=user.id).order_by(Post.created_at.desc()).all()
    if current_user_id is None:
        return jsonify([p.to_dict() for p in posts]), 200
    liked_post_ids = set(
        row[0] for row in db.session.execute(
            db.select(likes.c.post_id).where(likes.c.user_id == current_user_id)
        ).all()
    )
    enriched = []
    for p in posts:
        d = p.to_dict()
        d["liked"] = p.id in liked_post_ids
        enriched.append(d)
    return jsonify(enriched), 200


# --------------- UPDATE USER (PATCH) ---------------
@users_bp.route("/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")

    if username:
        user.username = username
    if email:
        # ensure email is unique
        existing = User.query.filter_by(email=email).first()
        if existing and existing.id != user_id:
            return jsonify({"error": "Email already in use"}), 400
        
        user.email = email

    db.session.commit()

    return jsonify({
        "message": "User updated successfully",
        "user": user.to_dict()
    }), 200


# --------------- DELETE USER ---------------
@users_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": f"User {user_id} deleted successfully"}), 200
