from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from ..extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(40), nullable=False, default="student")
    account_status = db.Column(db.String(30), nullable=False, default="active")
    college = db.Column(db.String(180))
    company = db.Column(db.String(180))
    avatar_url = db.Column(db.Text)
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login_at = db.Column(db.DateTime, nullable=True)

    events = db.relationship("Event", back_populates="creator", cascade="all,delete")
    registrations = db.relationship("Registration", back_populates="user", cascade="all,delete")
    bookmarks = db.relationship("Bookmark", back_populates="user", cascade="all,delete")
    notifications = db.relationship("Notification", back_populates="user", cascade="all,delete")
    verification_assets = db.relationship("OrganizerVerificationAsset", back_populates="user", cascade="all,delete")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
