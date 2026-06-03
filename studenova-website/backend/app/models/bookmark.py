from datetime import datetime
from ..extensions import db


class Bookmark(db.Model):
    __tablename__ = "bookmarks"
    __table_args__ = (db.UniqueConstraint("user_id", "event_id", name="uq_bookmark_user_event"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="bookmarks")
    event = db.relationship("Event", back_populates="bookmarks")
