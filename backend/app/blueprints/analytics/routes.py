from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from ...models import AnalyticsEvent, Event, Registration
from ...services.recommendations import recommended_events_for
from ...schemas import events_schema
from ...utils.auth import current_user, roles_required

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.get("/overview")
@roles_required("college_admin", "industry_organizer")
def overview():
    user = current_user()
    registrations = (
        Registration.query.join(Event)
        .filter(Event.creator_id == user.id)
        .with_entities(Event.category, func.count(Registration.id))
        .group_by(Event.category)
        .all()
    )
    events_count = Event.query.filter_by(creator_id=user.id).count()
    return jsonify({
        "events_count": events_count,
        "registrations_by_category": [{"category": row[0], "count": row[1]} for row in registrations],
    })


@analytics_bp.get("/recommendations")
@jwt_required()
def recommendations():
    return jsonify({"items": events_schema.dump(recommended_events_for(current_user()))})


@analytics_bp.get("/event/<int:event_id>")
@roles_required("college_admin", "industry_organizer")
def event_metrics(event_id):
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user().id:
        return jsonify({"message": "Only the creator can view analytics"}), 403
    metrics = AnalyticsEvent.query.filter_by(event_id=event.id).all()
    return jsonify({
        "registrations": len(event.registrations),
        "bookmarks": len(event.bookmarks),
        "popularity_score": event.popularity_score,
        "metrics": [{"metric": item.metric, "value": item.value, "dimension": item.dimension} for item in metrics],
    })
