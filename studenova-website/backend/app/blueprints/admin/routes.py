from flask import Blueprint, jsonify, request

from ...extensions import db
from ...models import Event, User
from ...utils.auth import roles_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/activity")
def activity_alias():
    from ..analytics.routes import admin_activity

    return admin_activity()


@admin_bp.patch("/verifications/<int:user_id>")
def verification_alias(user_id):
    from ..analytics.routes import update_admin_verification

    return update_admin_verification(user_id)


@admin_bp.post("/notifications")
def notification_alias():
    from ..analytics.routes import send_admin_notification

    return send_admin_notification()


@admin_bp.patch("/achievements/<int:achievement_id>")
def achievement_alias(achievement_id):
    from ..analytics.routes import update_admin_achievement

    return update_admin_achievement(achievement_id)


@admin_bp.patch("/users/<int:user_id>")
@roles_required("admin")
def update_user_status(user_id):
    user = User.query.get_or_404(user_id)
    action = (request.get_json() or {}).get("action")
    status_by_action = {
        "activate": "active",
        "suspend": "suspended",
        "ban": "banned",
    }
    if action not in status_by_action:
        return jsonify({"message": "Unsupported user action"}), 400
    if user.role == "admin":
        return jsonify({"message": "Admin accounts cannot be managed from this list"}), 400

    user.account_status = status_by_action[action]
    db.session.commit()
    return jsonify({"message": "User status updated", "user_id": user.id, "account_status": user.account_status})


@admin_bp.patch("/events/<int:event_id>")
@roles_required("admin")
def update_event_status(event_id):
    event = Event.query.get_or_404(event_id)
    action = (request.get_json() or {}).get("action")
    status_by_action = {
        "publish": "published",
        "flag": "flagged",
        "cancel": "cancelled",
        "complete": "completed",
        "archive": "archived",
    }
    if action not in status_by_action:
        return jsonify({"message": "Unsupported event action"}), 400

    event.status = status_by_action[action]
    db.session.commit()
    return jsonify({"message": "Event status updated", "event_id": event.id, "status": event.status})
