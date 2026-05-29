from datetime import datetime
from ..extensions import db


event_tags = db.Table(
    "event_tags",
    db.Column("event_id", db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False, index=True)
    slug = db.Column(db.String(220), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), nullable=False, index=True)
    domain = db.Column(db.String(120), index=True)
    mode = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(180), nullable=False)
    college = db.Column(db.String(180), index=True)
    conducting_organization = db.Column(db.String(180), index=True)
    eligibility = db.Column(db.Text)
    team_size = db.Column(db.String(40))
    prize_pool = db.Column(db.Numeric(12, 2), default=0)
    rules = db.Column(db.Text)
    schedule = db.Column(db.JSON, default=list)
    contact_email = db.Column(db.String(255))
    faqs = db.Column(db.JSON, default=list)
    seats_available = db.Column(db.Integer, default=0)
    registration_link = db.Column(db.Text)
    poster_url = db.Column(db.Text)
    starts_at = db.Column(db.DateTime, nullable=False, index=True)
    ends_at = db.Column(db.DateTime)
    registration_deadline = db.Column(db.DateTime, nullable=False, index=True)
    status = db.Column(db.String(30), default="published", nullable=False, index=True)
    popularity_score = db.Column(db.Float, default=0, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    organizer_id = db.Column(db.Integer, db.ForeignKey("organizers.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    creator = db.relationship("User", back_populates="events")
    organizer = db.relationship("Organizer", back_populates="events")
    registrations = db.relationship("Registration", back_populates="event", cascade="all,delete")
    bookmarks = db.relationship("Bookmark", back_populates="event", cascade="all,delete")
    analytics = db.relationship("AnalyticsEvent", back_populates="event", cascade="all,delete")
    tags = db.relationship("Tag", secondary=event_tags, back_populates="events")


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), unique=True, nullable=False, index=True)
    events = db.relationship("Event", secondary=event_tags, back_populates="tags")
