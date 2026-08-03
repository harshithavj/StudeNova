from uuid import uuid4
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ...extensions import db
from ...models import Event, Registration
from ...schemas import registration_schema, registrations_schema
from ...services.notifications import schedule_registration_reminders
from ...utils.auth import current_user, roles_required

registrations_bp = Blueprint("registrations", __name__)


@registrations_bp.post("/events/<int:event_id>")
@jwt_required()
def register_for_event(event_id):
    user = current_user()
    event = Event.query.get_or_404(event_id)
    existing = Registration.query.filter_by(user_id=user.id, event_id=event.id).first()
    if existing:
        return jsonify(registration_schema.dump(existing)), 200
    if event.seats_available and len(event.registrations) >= event.seats_available:
        return jsonify({"message": "No seats available"}), 409
    registration = Registration(user_id=user.id, event=event, qr_token=uuid4().hex)
    event.popularity_score += 5
    db.session.add(registration)
    schedule_registration_reminders(registration)
    db.session.commit()
    return jsonify(registration_schema.dump(registration)), 201


@registrations_bp.post("/events/<int:event_id>/complete-external")
@jwt_required()
def complete_external_registration(event_id):
    user = current_user()
    event = Event.query.get_or_404(event_id)
    payload = request.get_json() or {}
    registration = Registration.query.filter_by(user_id=user.id, event_id=event.id).first()
    if not registration:
        registration = Registration(user_id=user.id, event=event, qr_token=uuid4().hex)
        db.session.add(registration)
    registration.status = "registered"
    registration.external_platform = payload.get("external_platform")
    registration.external_registration_url = payload.get("external_registration_url") or event.registration_link
    registration.marked_completed_at = datetime.utcnow()
    event.popularity_score += 3
    schedule_registration_reminders(registration)
    db.session.commit()
    return jsonify(registration_schema.dump(registration)), 201


@registrations_bp.get("/me")
@jwt_required()
def my_registrations():
    return jsonify({"items": registrations_schema.dump(Registration.query.filter_by(user_id=current_user().id).all())})


@registrations_bp.get("/events/<int:event_id>")
@roles_required("college_organizer", "industry_organizer")
def event_registrations(event_id):
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user().id:
        return jsonify({"message": "Only the event creator can view registrations"}), 403
    return jsonify({"items": registrations_schema.dump(event.registrations)})


@registrations_bp.put("/<int:registration_id>/status")
@roles_required("college_organizer", "industry_organizer")
def update_registration_status(registration_id):
    registration = Registration.query.get_or_404(registration_id)
    if registration.event.creator_id != current_user().id:
        return jsonify({"message": "Only the event creator can update registrations"}), 403

    status = (request.get_json() or {}).get("status", "").strip().lower()
    if status not in {"approved", "rejected"}:
        return jsonify({"message": "Status must be approved or rejected"}), 422

    registration.status = status
    if status == "rejected":
        registration.rejection_reason = (request.get_json() or {}).get("rejection_reason", "").strip() or None
    else:
        registration.rejection_reason = None
    db.session.commit()
    return jsonify(registration_schema.dump(registration))


@registrations_bp.post("/check-in/<qr_token>")
@roles_required("college_organizer", "industry_organizer")
def check_in(qr_token):
    registration = Registration.query.filter_by(qr_token=qr_token).first_or_404()
    registration.status = "checked_in"
    db.session.commit()
    return jsonify(registration_schema.dump(registration))
