from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from ...extensions import db
from ...models import AnalyticsEvent, Bookmark, Event, Notification, OrganizerVerificationAsset, Registration, StudentAchievement, User
from ...services.recommendations import recommended_events_for
from ...schemas import events_schema
from ...utils.auth import current_user, roles_required

analytics_bp = Blueprint("analytics", __name__)


def serialize_datetime(value):
    return value.isoformat() if value else None


def organizer_verification_status(user):
    statuses = [asset.status for asset in user.verification_assets]
    if not statuses:
        return "not_submitted"
    if any(status == "suspended" for status in statuses):
        return "suspended"
    if any(status == "rejected" for status in statuses):
        return "rejected"
    if any(status == "more_info_requested" for status in statuses):
        return "more_info_requested"
    if all(status == "approved" for status in statuses):
        return "approved"
    return "pending"


def serialize_verification_request(user):
    assets = sorted(user.verification_assets, key=lambda asset: asset.created_at, reverse=True)
    return {
        "user_id": user.id,
        "organizer_name": user.name,
        "organization_name": user.college or user.company or "Not provided",
        "college_name": user.college,
        "company_name": user.company,
        "official_email": user.email,
        "department": "Not captured",
        "designation": user.role.replace("_", " ").title(),
        "role": user.role,
        "status": organizer_verification_status(user),
        "submission_date": serialize_datetime(assets[-1].created_at if assets else user.created_at),
        "documents": [
            {
                "id": asset.id,
                "asset_type": asset.asset_type,
                "file_name": asset.file_name,
                "file_url": asset.file_url,
                "content_type": asset.content_type,
                "status": asset.status,
                "created_at": serialize_datetime(asset.created_at),
            }
            for asset in assets
        ],
    }


def serialize_event_monitoring(event):
    return {
        "id": event.id,
        "event_name": event.title,
        "organizer": event.creator.name if event.creator else event.conducting_organization or "Unknown organizer",
        "participants": len(event.registrations),
        "status": event.status,
        "category": event.category,
        "date": serialize_datetime(event.starts_at),
    }


def serialize_user_management(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "account_status": user.account_status or "active",
        "college": user.college,
        "company": user.company,
        "verification_status": organizer_verification_status(user) if user.role in ["college_admin", "industry_organizer"] else "not_required",
        "events_created": len(user.events),
        "participation_count": len(user.registrations),
        "achievements_count": StudentAchievement.query.filter_by(user_id=user.id).count(),
        "reports_against_user": 0,
        "created_at": serialize_datetime(user.created_at),
    }


def serialize_achievement_review(achievement):
    user = User.query.get(achievement.user_id)
    event = Event.query.get(achievement.event_id) if achievement.event_id else None
    uploaded_certificate = achievement.certificate_url or achievement.proof_url
    return {
        "id": achievement.id,
        "student_name": user.name if user else "Unknown student",
        "college": user.college if user else "Not provided",
        "event_name": event.title if event else "Manual achievement",
        "achievement_type": achievement.achievement_type.replace("_", " ").title(),
        "uploaded_certificate": uploaded_certificate,
        "submission_date": serialize_datetime(achievement.created_at),
        "status": "pending_review" if uploaded_certificate else "draft",
    }


def build_event_monitoring():
    now = datetime.utcnow()
    events = Event.query.order_by(Event.starts_at.desc()).all()
    return {
        "upcoming": [serialize_event_monitoring(event) for event in events if event.status == "published" and event.starts_at > now],
        "ongoing": [
            serialize_event_monitoring(event)
            for event in events
            if event.status == "published" and event.starts_at <= now and (not event.ends_at or event.ends_at >= now)
        ],
        "completed": [
            serialize_event_monitoring(event)
            for event in events
            if event.status in ["completed", "archived"] or (event.ends_at and event.ends_at < now)
        ],
        "cancelled": [serialize_event_monitoring(event) for event in events if event.status == "cancelled"],
        "flagged": [serialize_event_monitoring(event) for event in events if event.status == "flagged"],
    }


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


@analytics_bp.get("/admin-activity")
@roles_required("admin")
def admin_activity():
    college_organizers = User.query.filter_by(role="college_admin").all()
    industry_organizers = User.query.filter_by(role="industry_organizer").all()
    verification_users = [user for user in [*college_organizers, *industry_organizers] if user.verification_assets]
    verification_requests = [serialize_verification_request(user) for user in verification_users]
    pending_verifications = [item for item in verification_requests if item["status"] in ["pending", "more_info_requested"]]
    verified_college_organizers = sum(1 for user in college_organizers if organizer_verification_status(user) == "approved")
    verified_industry_organizers = sum(1 for user in industry_organizers if organizer_verification_status(user) == "approved")

    role_breakdown = (
        User.query.with_entities(User.role, func.count(User.id))
        .group_by(User.role)
        .all()
    )
    category_breakdown = (
        Event.query.with_entities(Event.category, func.count(Event.id))
        .group_by(Event.category)
        .order_by(func.count(Event.id).desc())
        .all()
    )
    status_breakdown = (
        Event.query.with_entities(Event.status, func.count(Event.id))
        .group_by(Event.status)
        .all()
    )
    top_events = (
        Event.query.outerjoin(Registration)
        .with_entities(
            Event.id,
            Event.title,
            Event.category,
            Event.status,
            Event.popularity_score,
            func.count(Registration.id).label("registrations_count"),
        )
        .group_by(Event.id)
        .order_by(func.count(Registration.id).desc(), Event.popularity_score.desc())
        .limit(6)
        .all()
    )

    recent_activity = []
    for user in User.query.order_by(User.created_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"user-{user.id}",
            "type": "User",
            "title": f"{user.name} joined as {user.role.replace('_', ' ')}",
            "detail": user.email,
            "occurred_at": serialize_datetime(user.created_at),
        })
    for user in User.query.filter(User.last_login_at.isnot(None)).order_by(User.last_login_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"login-{user.id}-{int(user.last_login_at.timestamp())}",
            "type": "Login",
            "title": f"{user.name} logged in",
            "detail": f"{user.email} ({user.role.replace('_', ' ')})",
            "occurred_at": serialize_datetime(user.last_login_at),
        })
    for event in Event.query.order_by(Event.created_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"event-{event.id}",
            "type": "Event",
            "title": event.title,
            "detail": f"{event.category} by {event.conducting_organization or event.college or 'STUDENOVA'}",
            "occurred_at": serialize_datetime(event.created_at),
        })
    for registration in Registration.query.order_by(Registration.created_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"registration-{registration.id}",
            "type": "Registration",
            "title": registration.event.title if registration.event else "Event registration",
            "detail": registration.user.email if registration.user else "Unknown user",
            "occurred_at": serialize_datetime(registration.created_at),
        })
    for bookmark in Bookmark.query.order_by(Bookmark.created_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"bookmark-{bookmark.id}",
            "type": "Bookmark",
            "title": bookmark.event.title if bookmark.event else "Saved event",
            "detail": bookmark.user.email if bookmark.user else "Unknown user",
            "occurred_at": serialize_datetime(bookmark.created_at),
        })
    for notification in Notification.query.order_by(Notification.created_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"notification-{notification.id}",
            "type": "Notification",
            "title": notification.title,
            "detail": notification.stage,
            "occurred_at": serialize_datetime(notification.created_at),
        })
    for metric in AnalyticsEvent.query.order_by(AnalyticsEvent.recorded_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"metric-{metric.id}",
            "type": "Metric",
            "title": metric.metric,
            "detail": f"{metric.value:g}{f' - {metric.dimension}' if metric.dimension else ''}",
            "occurred_at": serialize_datetime(metric.recorded_at),
        })
    for achievement in StudentAchievement.query.order_by(StudentAchievement.created_at.desc()).limit(8).all():
        recent_activity.append({
            "id": f"achievement-{achievement.id}",
            "type": "Achievement",
            "title": achievement.title,
            "detail": f"{achievement.achievement_type} proof uploaded",
            "occurred_at": serialize_datetime(achievement.created_at),
        })
    for request_item in verification_requests[:8]:
        recent_activity.append({
            "id": f"verification-{request_item['user_id']}",
            "type": "Verification",
            "title": f"{request_item['organizer_name']} submitted verification",
            "detail": request_item["organization_name"],
            "occurred_at": request_item["submission_date"],
        })

    recent_activity = sorted(
        recent_activity,
        key=lambda item: item["occurred_at"] or "",
        reverse=True,
    )[:24]
    all_users = User.query.order_by(User.created_at.desc()).all()
    uploaded_achievements = (
        StudentAchievement.query
        .filter((StudentAchievement.proof_url.isnot(None)) | (StudentAchievement.certificate_url.isnot(None)))
        .order_by(StudentAchievement.created_at.desc())
        .limit(30)
        .all()
    )
    achievement_queue = [serialize_achievement_review(achievement) for achievement in uploaded_achievements]
    active_colleges = (
        Event.query.with_entities(Event.college, func.count(Event.id))
        .filter(Event.college.isnot(None))
        .group_by(Event.college)
        .order_by(func.count(Event.id).desc())
        .limit(6)
        .all()
    )

    return jsonify({
        "totals": {
            "users": User.query.count(),
            "students": User.query.filter_by(role="student").count(),
            "verified_college_organizers": verified_college_organizers,
            "verified_industry_organizers": verified_industry_organizers,
            "organizers": len(college_organizers) + len(industry_organizers),
            "events": Event.query.count(),
            "active_events": Event.query.filter_by(status="published").count(),
            "completed_events": Event.query.filter(Event.status.in_(["completed", "archived"])).count(),
            "published_events": Event.query.filter_by(status="published").count(),
            "pending_verifications": len(pending_verifications),
            "pending_reports": 0,
            "pending_achievement_reviews": StudentAchievement.query.filter(
                (StudentAchievement.proof_url.isnot(None)) | (StudentAchievement.certificate_url.isnot(None))
            ).count(),
            "registrations": Registration.query.count(),
            "bookmarks": Bookmark.query.count(),
            "notifications": Notification.query.count(),
            "analytics_events": AnalyticsEvent.query.count(),
        },
        "role_breakdown": [{"name": role.replace("_", " ").title(), "value": count} for role, count in role_breakdown],
        "category_breakdown": [{"name": category or "Uncategorized", "value": count} for category, count in category_breakdown],
        "status_breakdown": [{"name": status.title(), "value": count} for status, count in status_breakdown],
        "top_events": [
            {
                "id": event_id,
                "title": title,
                "category": category,
                "status": status,
                "popularity_score": popularity_score,
                "registrations_count": registrations_count,
            }
            for event_id, title, category, status, popularity_score, registrations_count in top_events
        ],
        "recent_activity": recent_activity,
        "verification_requests": verification_requests,
        "live_activity": recent_activity[:12],
        "event_monitoring": build_event_monitoring(),
        "user_management": {
            "students": [serialize_user_management(user) for user in all_users if user.role == "student"],
            "college_organizers": [serialize_user_management(user) for user in all_users if user.role == "college_admin"],
            "industry_organizers": [serialize_user_management(user) for user in all_users if user.role == "industry_organizer"],
        },
        "achievement_queue": achievement_queue,
        "reports_queue": [],
        "analytics_summary": {
            "user_growth": role_breakdown and [{"name": role.replace("_", " ").title(), "value": count} for role, count in role_breakdown] or [],
            "most_popular_events": [
                {"name": title, "value": registrations_count}
                for _, title, _, _, _, registrations_count in top_events
            ],
            "most_active_colleges": [{"name": college, "value": count} for college, count in active_colleges],
            "domain_analytics": [{"name": category or "Uncategorized", "value": count} for category, count in category_breakdown],
            "achievement_analytics": {
                "uploaded": StudentAchievement.query.count(),
                "pending_review": len(achievement_queue),
            },
        },
        "audit_logs": [
            {
                "timestamp": item["occurred_at"],
                "action": item["title"],
                "user": item["detail"],
                "role": item["type"],
                "status": "recorded",
            }
            for item in recent_activity
        ],
        "settings": {
            "verification_rules": "All organizer documents must be reviewed before trust badges are granted.",
            "achievement_verification_rules": "Student achievements with certificate or proof URLs enter admin review.",
            "notification_settings": "Platform-wide in-app notification broadcast is enabled.",
            "email_templates": "SMTP-backed OTP templates are managed by backend environment settings.",
            "platform_policies": "Reports and moderation queues are reserved for the reports module.",
            "role_permissions": "Admin-only endpoints require role=admin.",
        },
    })


@analytics_bp.patch("/admin-verifications/<int:user_id>")
@roles_required("admin")
def update_admin_verification(user_id):
    user = User.query.get_or_404(user_id)
    if user.role not in ["college_admin", "industry_organizer"]:
        return jsonify({"message": "Only organizer accounts can be verified"}), 400

    action = (request.get_json() or {}).get("action")
    status_by_action = {
        "approve": "approved",
        "reject": "rejected",
        "request_more_information": "more_info_requested",
        "suspend": "suspended",
    }
    if action not in status_by_action:
        return jsonify({"message": "Unsupported verification action"}), 400
    if not user.verification_assets:
        return jsonify({"message": "No verification documents found"}), 400

    for asset in user.verification_assets:
        asset.status = status_by_action[action]
    db.session.commit()
    return jsonify({"message": "Verification updated", "request": serialize_verification_request(user)})


@analytics_bp.post("/admin-notifications")
@roles_required("admin")
def send_admin_notification():
    payload = request.get_json() or {}
    title = payload.get("title")
    body = payload.get("body")
    recipient_group = payload.get("recipient_group", "all")
    if not title or not body:
        return jsonify({"message": "Title and body are required"}), 400

    query = User.query
    if recipient_group == "students":
        query = query.filter_by(role="student")
    elif recipient_group == "college_organizers":
        query = query.filter_by(role="college_admin")
    elif recipient_group == "industry_organizers":
        query = query.filter_by(role="industry_organizer")
    elif recipient_group != "all":
        return jsonify({"message": "Unsupported recipient group"}), 400

    recipients = query.all()
    for user in recipients:
        db.session.add(Notification(
            user_id=user.id,
            channel="in_app",
            title=title,
            body=body,
            stage="admin_broadcast",
            sent_at=datetime.utcnow(),
        ))
    db.session.commit()
    return jsonify({"message": "Notification sent", "recipients": len(recipients)})


@analytics_bp.patch("/admin-achievements/<int:achievement_id>")
@roles_required("admin")
def update_admin_achievement(achievement_id):
    achievement = StudentAchievement.query.get_or_404(achievement_id)
    action = (request.get_json() or {}).get("action")
    if action == "verify":
        achievement.is_public = True
        message = "Achievement verified"
    elif action in ["reject", "request_additional_proof"]:
        achievement.is_public = False
        message = "Achievement review updated"
    else:
        return jsonify({"message": "Unsupported achievement action"}), 400

    db.session.commit()
    return jsonify({"message": message, "achievement": serialize_achievement_review(achievement)})


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
