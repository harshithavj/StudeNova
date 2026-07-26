from datetime import datetime, timedelta
from ..extensions import db
from ..models import Bookmark, Event, Notification, Registration


def schedule_event_reminders(user_id: int, event: Event):
    stages = [
        ("deadline_7d", event.registration_deadline - timedelta(days=7), "Registration closes in 7 days"),
        ("deadline_3d", event.registration_deadline - timedelta(days=3), "Registration deadline is coming up"),
        ("deadline_24h", event.registration_deadline - timedelta(hours=24), "Registration closes tomorrow"),
        ("deadline_1h", event.registration_deadline - timedelta(hours=1), "Registration closes in 1 hour"),
        ("registration_closed", event.registration_deadline, "Registration has closed"),
        ("event_start", event.starts_at - timedelta(hours=1), "Your event starts soon"),
    ]
    for stage, when, title in stages:
        for channel in ("in_app", "email", "push"):
            existing = Notification.query.filter_by(
                user_id=user_id,
                event_id=event.id,
                channel=channel,
                stage=stage,
            ).first()
            if existing:
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
