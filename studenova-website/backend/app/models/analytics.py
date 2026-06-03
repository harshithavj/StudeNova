from datetime import datetime
from ..extensions import db


class AnalyticsEvent(db.Model):
    __tablename__ = "analytics"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    metric = db.Column(db.String(80), nullable=False)
    value = db.Column(db.Float, nullable=False, default=0)
    dimension = db.Column(db.String(120))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    event = db.relationship("Event", back_populates="analytics")
