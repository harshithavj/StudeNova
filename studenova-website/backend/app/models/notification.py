from datetime import datetime
from ..extensions import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"))
    channel = db.Column(db.String(40), default="in_app", nullable=False)
    title = db.Column(db.String(180), nullable=False)
    body = db.Column(db.Text, nullable=False)
    stage = db.Column(db.String(60), default="general", nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    scheduled_for = db.Column(db.DateTime)
    sent_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="notifications")
