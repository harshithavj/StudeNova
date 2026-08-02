from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ...extensions import db
from ...models import Notification
from ...schemas import notification_schema, notifications_schema
from ...services.notifications import create_closed_event_notifications, refresh_user_reminders
from ...utils.auth import current_user

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.get("")
@jwt_required()
def list_notifications():
    from datetime import datetime
    from sqlalchemy import or_
    now = datetime.utcnow()
    refresh_user_reminders(current_user().id, now)
    create_closed_event_notifications(current_user().id, now)
    db.session.commit()
    items = Notification.query.filter(
        Notification.user_id == current_user().id,
        Notification.channel == "in_app",
        or_(Notification.scheduled_for.is_(None), Notification.scheduled_for <= now)
    ).order_by(Notification.created_at.desc()).all()
    return jsonify({"items": notifications_schema.dump(items)})


@notifications_bp.patch("/<int:notification_id>/read")
@jwt_required()
def mark_read(notification_id):
    notification = Notification.query.filter_by(id=notification_id, user_id=current_user().id).first_or_404()
    notification.is_read = True
    db.session.commit()
    return jsonify(notification_schema.dump(notification))
