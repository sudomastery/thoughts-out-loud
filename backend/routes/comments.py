from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.comment import Comment
from models.post import Post

comments_bp = Blueprint('comments', __name__, url_prefix='/posts/<int:post_id>/comments')

@comments_bp.route('', methods=['GET'])
def list_comments(post_id):
    # Ensure post exists
    Post.query.get_or_404(post_id)
    rows = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.desc()).all()
    return jsonify([c.to_dict() for c in rows]), 200

@comments_bp.route('', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    Post.query.get_or_404(post_id)
    data = request.get_json() or {}
    content = data.get('content')
    if not content:
        return jsonify({'error': 'content is required'}), 400
    user_id = int(get_jwt_identity())
    c = Comment(content=content, post_id=post_id, user_id=user_id)
    db.session.add(c)
    db.session.commit()
    return jsonify({'message': 'Comment created', 'comment': c.to_dict()}), 201