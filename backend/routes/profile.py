from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User

profile_bp = Blueprint("profile", __name__, url_prefix="/profile")

# ----------------------- GET PROFILE -----------------------
@profile_bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            # Add other profile fields as needed
        }
    }), 200

# ----------------------- UPDATE PROFILE -----------------------
@profile_bp.route("/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json() or {}
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Update allowed fields
    if 'username' in data and data['username']:
        # Check if username is taken by another user
        existing = User.query.filter(
            User.username == data['username'], 
            User.id != user_id
        ).first()
        if existing:
            return jsonify({"error": "Username already taken"}), 400
        user.username = data['username']
    
    # Add other updatable fields as needed (email, bio, etc.)
    
    db.session.commit()
    
    return jsonify({
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200