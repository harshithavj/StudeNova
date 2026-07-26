from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ...extensions import db
from ...models import Bookmark, Event
from ...schemas import events_schema
from ...services.notifications import create_closed_event_notifications, schedule_event_reminders
from ...utils.auth import current_user

bookmarks_bp = Blueprint("bookmarks", __name__)


@bookmarks_bp.get("")
@jwt_required()
def list_bookmarks():
    events = Event.query.join(Bookmark).filter(Bookmark.user_id == current_user().id).all()
    return jsonify({"items": events_schema.dump(events)})


@bookmarks_bp.post("/events/<int:event_id>")
@jwt_required()
def save_event(event_id):
    user = current_user()
    event = Event.query.get_or_404(event_id)
    bookmark = Bookmark.query.filter_by(user_id=user.id, event_id=event_id).first()
    if not bookmark:
        db.session.add(Bookmark(user_id=user.id, event_id=event_id))
        schedule_event_reminders(user.id, event)
        db.session.commit()
    create_closed_event_notifications(user.id)
    db.session.commit()
    return jsonify({"message": "Event saved"})


@bookmarks_bp.delete("/events/<int:event_id>")
@jwt_required()
def unsave_event(event_id):
    Bookmark.query.filter_by(user_id=current_user().id, event_id=event_id).delete()
    db.session.commit()
    return jsonify({"message": "Event removed from saved list"})
