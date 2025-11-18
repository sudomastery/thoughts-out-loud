# backend/routes/auth.py

from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from models.user import User
from itsdangerous import URLSafeTimedSerializer

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# ----------------------- SIGNUP -----------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Validate fields
    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    # Check if email already exists
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 400

    # Hash the password
    hashed_pw = generate_password_hash(password)

    # Create new user
    user = User(username=username, email=email, password=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 201


# ----------------------- LOGIN -----------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check password
    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200



# ----------------------- FORGOT PASSWORD -----------------------
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    # For security, always return success even if email doesn't exist
    if user:
        # Generate reset token
        reset_token = generate_reset_token(user.email)
        print(f"Password reset token for {email}: {reset_token}")  # For testing
        
        # TODO: In production, send email with reset link
        # reset_link = f"http://localhost:3000/reset-password/{reset_token}"
        # send_reset_email(user.email, reset_link)
    
    return jsonify({
        "message": "If that email exists, a password reset link has been sent"
    }), 200

# ----------------------- RESET PASSWORD -----------------------
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}
    token = data.get("token")
    new_password = data.get("new_password")
    
    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400
    
    # Verify token
    email = verify_reset_token(token)
    if not email:
        return jsonify({"error": "Invalid or expired reset token"}), 400
    
    # Update user password
    user = User.query.filter_by(email=email).first()
    if user:
        user.password = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({"message": "Password reset successfully"}), 200
    
    return jsonify({"error": "User not found"}), 404

# ----------------------- HELPER FUNCTIONS -----------------------
def generate_reset_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='password-reset-salt')

def verify_reset_token(token, expiration=3600):  # 1 hour expiry
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt='password-reset-salt',
            max_age=expiration
        )
    except:
        return None
    return email