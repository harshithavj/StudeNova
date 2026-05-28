from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ...extensions import db
from ...models import Notification
from ...schemas import notification_schema, notifications_schema
from ...utils.auth import current_user

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.get("")
@jwt_required()
def list_notifications():
    items = Notification.query.filter_by(user_id=current_user().id).order_by(Notification.created_at.desc()).all()
    return jsonify({"items": notifications_schema.dump(items)})


@notifications_bp.patch("/<int:notification_id>/read")
@jwt_required()
def mark_read(notification_id):
    notification = Notification.query.filter_by(id=notification_id, user_id=current_user().id).first_or_404()
    notification.is_read = True
    db.session.commit()
    return jsonify(notification_schema.dump(notification))
