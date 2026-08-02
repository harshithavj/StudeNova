from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ...extensions import db
from ...models import Event, Tag
from ...schemas import event_create_schema, event_schema, events_schema
from ...services.notifications import schedule_event_reminders
from ...services.storage import upload_event_poster
from ...utils.auth import current_user, roles_required
from ...utils.slug import slugify

events_bp = Blueprint("events", __name__)


def apply_event_filters(query):
    q = request.args.get("q")
    category = request.args.get("category")
    domain = request.args.get("domain")
    mode = request.args.get("mode")
    eligibility = request.args.get("eligibility")
    organization = request.args.get("organization")
    college = request.args.get("college")
    location = request.args.get("location")
    sort = request.args.get("sort", "trending")
    if q:
        query = query.filter(Event.title.ilike(f"%{q}%") | Event.description.ilike(f"%{q}%"))
    if category:
        query = query.filter(Event.category == category)
    if domain:
        query = query.filter(Event.domain == domain)
    if mode:
        query = query.filter(Event.mode == mode.lower())
    if eligibility:
        query = query.filter(Event.eligibility.ilike(f"%{eligibility}%"))
    if organization:
        query = query.filter(Event.conducting_organization.ilike(f"%{organization}%"))
    if college:
        query = query.filter(Event.college.ilike(f"%{college}%"))
    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))
    if sort == "newest":
        query = query.order_by(Event.created_at.desc())
    elif sort == "deadline":
        query = query.order_by(Event.registration_deadline.asc())
    else:
        query = query.order_by(Event.popularity_score.desc(), Event.starts_at.asc())
    return query


@events_bp.get("")
def list_events():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 12, type=int), 50)
    pagination = apply_event_filters(Event.query.filter_by(status="published")).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({"items": events_schema.dump(pagination.items), "total": pagination.total, "page": page})


@events_bp.post("")
@roles_required("college_organizer", "industry_organizer")
def create_event():
    payload = event_create_schema.load(request.get_json() or {})
    user = current_user()
    event = Event(**{key: value for key, value in payload.items() if key != "tags"}, creator_id=user.id, slug=slugify(payload["title"]))
    for tag_name in payload.get("tags", []):
        tag = Tag.query.filter_by(name=tag_name.lower()).first() or Tag(name=tag_name.lower())
        event.tags.append(tag)
    db.session.add(event)
    db.session.commit()
    return jsonify(event_schema.dump(event)), 201


@events_bp.get("/mine")
@roles_required("college_organizer", "industry_organizer")
def list_my_events():
    events = Event.query.filter_by(creator_id=current_user().id).order_by(Event.starts_at.desc()).all()
    return jsonify({"items": events_schema.dump(events), "total": len(events)})


@events_bp.get("/<int:event_id>")
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    event.popularity_score += 0.5
    db.session.commit()
    return jsonify(event_schema.dump(event))


@events_bp.put("/<int:event_id>")
@roles_required("college_organizer", "industry_organizer")
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user().id:
        return jsonify({"message": "Only the event creator can edit this event"}), 403
    payload = event_create_schema.load(request.get_json() or {}, partial=True)
    for key, value in payload.items():
        if key != "tags":
            setattr(event, key, value)
    if "tags" in payload:
        event.tags = [Tag.query.filter_by(name=name.lower()).first() or Tag(name=name.lower()) for name in payload["tags"]]
    tracked_user_ids = {
        registration.user_id for registration in event.registrations
    } | {
        bookmark.user_id for bookmark in event.bookmarks
    }
    for user_id in tracked_user_ids:
        schedule_event_reminders(user_id, event)
    db.session.commit()
    return jsonify(event_schema.dump(event))


@events_bp.delete("/<int:event_id>")
@roles_required("college_organizer", "industry_organizer")
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user().id:
        return jsonify({"message": "Only the event creator can delete this event"}), 403
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"})


@events_bp.post("/<int:event_id>/poster")
@jwt_required()
def upload_poster(event_id):
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user().id:
        return jsonify({"message": "Only the event creator can upload posters"}), 403
    file = request.files.get("poster")
    if not file:
        return jsonify({"message": "Missing poster file"}), 400
    event.poster_url = upload_event_poster(file, f"events/{event.id}/{file.filename}")
    db.session.commit()
    return jsonify({"poster_url": event.poster_url})
