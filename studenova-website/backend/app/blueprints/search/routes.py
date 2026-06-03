from flask import Blueprint, jsonify, request
from ...models import Event
from ...schemas import events_schema

search_bp = Blueprint("search", __name__)


@search_bp.get("")
def search():
    q = request.args.get("q", "")
    query = Event.query.filter(Event.status == "published")
    if q:
        query = query.filter(Event.title.ilike(f"%{q}%") | Event.description.ilike(f"%{q}%") | Event.location.ilike(f"%{q}%"))
    return jsonify({"items": events_schema.dump(query.order_by(Event.popularity_score.desc()).limit(20).all())})
