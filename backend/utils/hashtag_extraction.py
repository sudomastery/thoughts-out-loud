# backend/utils/hashtag_extraction.py
# PURPOSE: Extract hashtags from a post content string and ensure entries exist in DB.
# BEGINNER: If you write a post like "Hello #World", we want to save "world" in a table
# so later we can find all posts with #world.

import re
from extensions import db
from models.hashtag import Hashtag
from models.post_hashtag import post_hashtags

HASHTAG_REGEX = re.compile(r"#([A-Za-z0-9_]+)")

def extract_hashtags(text: str):
    return [m.lower() for m in HASHTAG_REGEX.findall(text or "")]

def attach_hashtags(post, content: str):
    names = extract_hashtags(content)
    if not names:
        return
    existing = {h.name.lower(): h for h in Hashtag.query.filter(Hashtag.name.in_(names)).all()}
    tag_ids = []
    for n in names:
        tag = existing.get(n)
        if not tag:
            tag = Hashtag(name=n)
            db.session.add(tag)
            db.session.flush()  # get id without full commit
            existing[n] = tag
        tag_ids.append(tag.id)
    # Insert associations (avoid duplicates)
    for tid in tag_ids:
        db.session.execute(
            post_hashtags.insert().values(post_id=post.id, hashtag_id=tid)
        )
