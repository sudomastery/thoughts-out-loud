# backend/routes/posts.py

# Import required modules
from flask import Blueprint, request, jsonify
from extensions import db
from models.post import Post

# Create a Blueprint for posts routes (like a mini-app for just posts)
posts_bp = Blueprint("posts", __name__, url_prefix="/posts")

# ---------------- CREATE a new post ----------------
@posts_bp.route("", methods=["POST"])
def create_post():
    """
    Create a new post.
    Expected JSON body: { "content": "some text", "user_id": 1 }
    """
    data = request.get_json() or {}

    content = data.get("content")
    user_id = data.get("user_id")

    # Check for missing fields
    if not content or not user_id:
        return jsonify({"error": "content and user_id are required"}), 400

    # Create and save a new post
    post = Post(content=content, user_id=user_id)
    db.session.add(post)
    db.session.commit()

    return jsonify({
        "message": "Post created successfully",
        "post": post.to_dict()
    }), 201


# ---------------- READ all posts ----------------
@posts_bp.route("", methods=["GET"])
def get_all_posts():
    """
    Get a list of all posts (most recent first)
    """
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts]), 200


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
def update_post(post_id):
    """
    Update an existing post's content.
    Example JSON: { "content": "Updated text" }
    """
    post = Post.query.get_or_404(post_id)
    data = request.get_json() or {}

    # Only allow content to be updated
    content = data.get("content")
    if content:
        post.content = content
        db.session.commit()

    return jsonify({
        "message": "Post updated successfully",
        "post": post.to_dict()
    }), 200


# ---------------- DELETE a post ----------------
@posts_bp.route("/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    """
    Delete a post by its ID.
    """
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": f"Post {post_id} deleted successfully"}), 200
