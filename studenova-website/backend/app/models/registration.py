from datetime import datetime
from ..extensions import db


class Registration(db.Model):
    __tablename__ = "registrations"
    __table_args__ = (db.UniqueConstraint("user_id", "event_id", name="uq_registration_user_event"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    status = db.Column(db.String(30), default="registered", nullable=False)
    rejection_reason = db.Column(db.String(255))
    external_platform = db.Column(db.String(120))
    external_registration_url = db.Column(db.Text)
    marked_completed_at = db.Column(db.DateTime)
    qr_token = db.Column(db.String(120), unique=True, nullable=False)
    checked_in_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="registrations")
    event = db.relationship("Event", back_populates="registrations")
