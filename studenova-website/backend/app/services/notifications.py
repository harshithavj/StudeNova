from datetime import datetime, timedelta
from ..extensions import db
from ..models import Bookmark, Event, Notification, Registration


REMINDER_STAGES = {
    "deadline_7d",
    "deadline_3d",
    "deadline_24h",
    "deadline_1h",
    "registration_closed",
    "event_start",
}


def event_reminder_stages(event: Event):
    return [
        ("deadline_7d", event.registration_deadline - timedelta(days=7), "Registration closes in 7 days"),
        ("deadline_3d", event.registration_deadline - timedelta(days=3), "Registration deadline is coming up"),
        ("deadline_24h", event.registration_deadline - timedelta(hours=24), "Registration closes tomorrow"),
        ("deadline_1h", event.registration_deadline - timedelta(hours=1), "Registration closes in 1 hour"),
        ("registration_closed", event.registration_deadline, "Registration has closed"),
        ("event_start", event.starts_at - timedelta(hours=1), "Your event starts soon"),
    ]


def schedule_event_reminders(user_id: int, event: Event):
    for stage, when, title in event_reminder_stages(event):
        for channel in ("in_app", "email", "push"):
            existing_items = Notification.query.filter_by(
                user_id=user_id,
                event_id=event.id,
                channel=channel,
                stage=stage,
            ).order_by(Notification.id.asc()).all()
            existing = existing_items[0] if existing_items else None
            if existing:
                existing.title = title
                existing.body = f"{event.title} is on your STUDENOVA schedule."
                existing.scheduled_for = when
                if when > datetime.utcnow():
                    existing.sent_at = None
                for duplicate in existing_items[1:]:
                    db.session.delete(duplicate)
                continue
            db.session.add(Notification(
                user_id=user_id,
                event_id=event.id,
                channel=channel,
                title=title,
                body=f"{event.title} is on your STUDENOVA schedule.",
                stage=stage,
                scheduled_for=when,
            ))


def schedule_registration_reminders(registration: Registration):
    schedule_event_reminders(registration.user_id, registration.event)


def schedule_tracked_event_reminders(user_id: int, now=None):
    """Backfill reminders for events a user registered for or saved previously."""
    now = now or datetime.utcnow()
    tracked_events = Event.query.outerjoin(
        Registration, Registration.event_id == Event.id
    ).outerjoin(
        Bookmark, Bookmark.event_id == Event.id
    ).filter(
        Event.registration_deadline > now,
        (Registration.user_id == user_id) | (Bookmark.user_id == user_id),
    ).all()
    for event in tracked_events:
        schedule_event_reminders(user_id, event)
    return len(tracked_events)


def refresh_user_reminders(user_id: int, now=None):
    now = now or datetime.utcnow()
    tracked_events = Event.query.outerjoin(
        Registration, Registration.event_id == Event.id
    ).outerjoin(
        Bookmark, Bookmark.event_id == Event.id
    ).filter(
        (Registration.user_id == user_id) | (Bookmark.user_id == user_id),
    ).all()
    for event in tracked_events:
        schedule_event_reminders(user_id, event)

    stale_notifications = Notification.query.filter(
        Notification.user_id == user_id,
        Notification.event_id.isnot(None),
        Notification.stage.in_(REMINDER_STAGES),
    ).all()
    current_event_ids = {event.id for event in tracked_events}
    for notification in stale_notifications:
        if notification.event_id not in current_event_ids:
            db.session.delete(notification)
    return len(tracked_events)


def create_closed_event_notifications(user_id: int, now=None):
    """Create one in-app alert for each tracked event whose registration just closed.

    This runs when a user retrieves notifications, so alerts remain reliable without
    requiring a separate background scheduler to be running at the deadline.
    """
    now = now or datetime.utcnow()
    tracked_events = Event.query.outerjoin(
        Registration, Registration.event_id == Event.id
    ).outerjoin(
        Bookmark, Bookmark.event_id == Event.id
    ).filter(
        Event.registration_deadline <= now,
        (Registration.user_id == user_id) | (Bookmark.user_id == user_id),
    ).all()

    if not tracked_events:
        return 0

    event_ids = [event.id for event in tracked_events]
    already_notified = {
        event_id for (event_id,) in Notification.query.with_entities(Notification.event_id).filter(
            Notification.user_id == user_id,
            Notification.channel == "in_app",
            Notification.stage == "registration_closed",
            Notification.event_id.in_(event_ids),
        ).all()
    }

    for event in tracked_events:
        if event.id not in already_notified:
            db.session.add(Notification(
                user_id=user_id,
                event_id=event.id,
                channel="in_app",
                title="Registration has closed",
                body=f"Registration for {event.title} has closed.",
                stage="registration_closed",
                scheduled_for=now,
                sent_at=now,
            ))
    return len(event_ids) - len(already_notified)
