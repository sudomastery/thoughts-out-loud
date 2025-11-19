# backend/routes/hashtags.py

from flask import Blueprint, request, jsonify
from extensions import db
from models.hashtag import Hashtag
from models.post import Post

hashtags_bp = Blueprint("hashtags", __name__, url_prefix="/hashtags")

# CREATE HASHTAG
@hashtags_bp.route("/", methods=["POST"])
def create_hashtag():
    data = request.get_json() or {}
    name = data.get("name")

    if not name:
        return jsonify({"error": "Hashtag name is required"}), 400

    # Clean hashtag format: remove # if user includes it
    formatted_name = name.lower().lstrip("#")

    # Check if exists
    existing = Hashtag.query.filter_by(name=formatted_name).first()
    if existing:
        return jsonify({"error": "Hashtag already exists"}), 400

    hashtag = Hashtag(name=formatted_name)
    db.session.add(hashtag)
    db.session.commit()

    return jsonify({"message": "Hashtag created", "hashtag": hashtag.to_dict()}), 201


# GET ALL HASHTAGS 
@hashtags_bp.route("/", methods=["GET"])
def get_hashtags():
    hashtags = Hashtag.query.all()
    return jsonify([h.to_dict() for h in hashtags]), 200


# GET POSTS BY HASHTAG
@hashtags_bp.route("/<string:name>/posts", methods=["GET"])
def get_posts_by_hashtag(name):
    hashtag = Hashtag.query.filter_by(name=name.lower()).first()

    if not hashtag:
        return jsonify({"error": "Hashtag not found"}), 404

    posts = hashtag.posts.all()
    return jsonify([p.to_dict() for p in posts]), 200


#  DELETE HASHTAG 
@hashtags_bp.route("/<int:id>", methods=["DELETE"])
def delete_hashtag(id):
    hashtag = Hashtag.query.get(id)

    if not hashtag:
        return jsonify({"error": "Hashtag not found"}), 404

    db.session.delete(hashtag)
    db.session.commit()
    return jsonify({"message": "Hashtag deleted"}), 200
