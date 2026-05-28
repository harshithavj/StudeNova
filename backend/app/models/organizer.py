from datetime import datetime
from ..extensions import db


class Organizer(db.Model):
    __tablename__ = "organizers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(180), nullable=False)
    type = db.Column(db.String(40), nullable=False)
    website = db.Column(db.Text)
    logo_url = db.Column(db.Text)
    verified = db.Column(db.Boolean, default=False, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    events = db.relationship("Event", back_populates="organizer")
