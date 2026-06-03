from datetime import datetime
from ..extensions import db


class OrganizerVerificationAsset(db.Model):
    __tablename__ = "organizer_verification_assets"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    asset_type = db.Column(db.String(80), nullable=False)
    file_url = db.Column(db.Text, nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    content_type = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(30), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="verification_assets")
