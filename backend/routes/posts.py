# backend/routes/posts.py

# Import required modules
from flask import Blueprint, request, jsonify
from extensions import db
from models.post import Post
from models.user import User
from models.like import likes
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request

# Create a Blueprint for posts routes (like a mini-app for just posts)
posts_bp = Blueprint("posts", __name__, url_prefix="/posts")

# ---------------- CREATE a new post ----------------
@posts_bp.route("", methods=["POST"])
@jwt_required()
def create_post():
    """
    Create a new post.
    Expected JSON body: { "content": "some text" }
    """
    data = request.get_json() or {}

    content = data.get("content")
    # Get user id from JWT identity instead of request body
    # JWT identity stored as string; cast to int for DB foreign key
    user_id = int(get_jwt_identity())

    # Check for missing fields
    if not content:
        return jsonify({"error": "content is required"}), 400

    # Create and save a new post
    post = Post(content=content, user_id=user_id)
    db.session.add(post)
    db.session.flush()  # obtain post.id before attaching hashtags

    # Extract & attach hashtags (if any)
    try:
        from utils.hashtag_extraction import attach_hashtags
        attach_hashtags(post, content)
    except Exception:
        pass  # keep post creation robust for now (log later)

    db.session.commit()

    return jsonify({
        "message": "Post created successfully",
    "post": { **post.to_dict(), "liked": False }
    }), 201


# ---------------- READ all posts ----------------
@posts_bp.route("", methods=["GET"])
def get_all_posts():
    """Get a list of all posts (most recent first). If JWT provided, include liked flag."""
    current_user_id = None
    try:
        verify_jwt_in_request()
        current_user_id = int(get_jwt_identity())
    except Exception:
        current_user_id = None  # no valid JWT provided; proceed unauthenticated
    posts = Post.query.order_by(Post.created_at.desc()).all()
    if current_user_id is None:
        return jsonify([p.to_dict() for p in posts]), 200
    from models.like import likes
    liked_post_ids = set(
        row[0] for row in db.session.execute(
            db.select(likes.c.post_id).where(likes.c.user_id == current_user_id)
        ).all()
    )
    enriched = []
    for p in posts:
        data = p.to_dict()
        data["liked"] = p.id in liked_post_ids
        enriched.append(data)
    return jsonify(enriched), 200


# ---------------- READ one post by ID ----------------
@posts_bp.route("/<int:post_id>", methods=["GET"])
def get_post(post_id):
    """
    Get a single post by its ID.
    Example URL: /posts/1
    """
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict()), 200


# ---------------- UPDATE a post ----------------
@posts_bp.route("/<int:post_id>", methods=["PATCH"])
@jwt_required()
def update_post(post_id):
    """Update an existing post's content (owner only); sets edited flag."""
    post = Post.query.get_or_404(post_id)
    user_id = int(get_jwt_identity())
    if post.user_id != user_id:
        return jsonify({"error": "Not authorized to edit this post"}), 403
    data = request.get_json() or {}
    content = data.get("content")
    if not content:
        return jsonify({"error": "content is required"}), 400
    post.content = content
    post.edited = True
    db.session.commit()
    return jsonify({"message": "Post updated successfully", "post": post.to_dict()}), 200


# ---------------- DELETE a post ----------------
@posts_bp.route("/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    """Delete a post by its ID (only owner). Also remove related comments & likes."""
    post = Post.query.get_or_404(post_id)
    user_id = int(get_jwt_identity())
    if post.user_id != user_id:
        return jsonify({"error": "Not authorized to delete this post"}), 403
    # Remove likes for post
    db.session.execute(likes.delete().where(likes.c.post_id == post.id))
    # Remove comments (if Comment model present)
    try:
        from models.comment import Comment
        Comment.query.filter_by(post_id=post.id).delete()
    except Exception:
        pass
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": f"Post {post_id} deleted successfully"}), 200


# ---------------- LIKE a post ----------------
@posts_bp.route("/<int:post_id>/like", methods=["POST"])
@jwt_required()
def like_post(post_id):
    """Add a like relationship between current authenticated user and the post."""
    post = Post.query.get_or_404(post_id)
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    # Check if already liked
    link = db.session.execute(
        likes.select().where(likes.c.user_id == user.id, likes.c.post_id == post.id)
    ).first()
    if link:
        return jsonify({"message": "Already liked"}), 200

    db.session.execute(likes.insert().values(user_id=user.id, post_id=post.id))
    db.session.commit()
    # Return updated like count
    count = db.session.execute(
        db.select(db.func.count()).select_from(likes).where(likes.c.post_id == post.id)
    ).scalar()
    return jsonify({"message": "Post liked", "likes_count": count}), 201


# ---------------- UNLIKE a post ----------------
@posts_bp.route("/<int:post_id>/like", methods=["DELETE"])
@jwt_required()
def unlike_post(post_id):
    """Remove like relationship for current user."""
    post = Post.query.get_or_404(post_id)
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    result = db.session.execute(
        likes.delete().where(likes.c.user_id == user.id, likes.c.post_id == post.id)
    )
    db.session.commit()
    if result.rowcount == 0:
        return jsonify({"message": "No like existed"}), 200

    count = db.session.execute(
        db.select(db.func.count()).select_from(likes).where(likes.c.post_id == post.id)
    ).scalar()
    return jsonify({"message": "Post unliked", "likes_count": count}), 200
