from models import db
from models.user import User
from models.post import Post
from models.hashtag import Hashtag
from models.follow import followers
from models.like import likes
from models.post_hashtag import post_hashtags
from flask import Flask

app = Flask(__name__)

# Update with your actual DB credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://sethmorara:sethmorara@localhost/thoughts_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    print("✅ All tables created successfully!")
 