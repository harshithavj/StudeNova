from datetime import datetime
from ..extensions import db


class StudentProfile(db.Model):
    __tablename__ = "student_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    department = db.Column(db.String(160))
    academic_year = db.Column(db.String(60))
    skills = db.Column(db.JSON, default=list)
    interests = db.Column(db.JSON, default=list)
    domains = db.Column(db.JSON, default=list)
    resume_url = db.Column(db.Text)
    portfolio_url = db.Column(db.Text)
    github_url = db.Column(db.Text)
    linkedin_url = db.Column(db.Text)
    participation_streak = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class StudentAchievement(db.Model):
    __tablename__ = "student_achievements"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="SET NULL"))
    title = db.Column(db.String(180), nullable=False)
    achievement_type = db.Column(db.String(80), nullable=False, default="participation")
    position = db.Column(db.String(80))
    cash_prize_amount = db.Column(db.Numeric(12, 2))
    certificate_url = db.Column(db.Text)
    proof_url = db.Column(db.Text)
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    awarded_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User")


class StudentEventReminder(db.Model):
    __tablename__ = "student_event_reminders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    reminder_type = db.Column(db.String(80), nullable=False)
    channel = db.Column(db.String(40), default="in_app", nullable=False)
    scheduled_for = db.Column(db.DateTime, nullable=False, index=True)
    sent_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class StudentConnection(db.Model):
    __tablename__ = "student_connections"
    __table_args__ = (db.UniqueConstraint("requester_id", "receiver_id", name="uq_student_connection_pair"),)

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = db.Column(db.String(30), default="pending", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class StudentCommunity(db.Model):
    __tablename__ = "student_communities"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), unique=True, nullable=False)
    domain = db.Column(db.String(120), nullable=False, index=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class EventDiscussionPost(db.Model):
    __tablename__ = "event_discussion_posts"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    body = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("event_discussion_posts.id", ondelete="CASCADE"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
