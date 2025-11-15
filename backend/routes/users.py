# backend/routes/users.py

from flask import Blueprint, jsonify, request
from extensions import db
from models.user import User

users_bp = Blueprint("users", __name__, url_prefix="/users")


# --------------- GET ALL USERS ---------------
@users_bp.route("", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


# --------------- GET ONE USER ---------------
@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200


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
