from datetime import timedelta
from ..extensions import db
from ..models import Notification, Registration


def schedule_registration_reminders(registration: Registration):
    event = registration.event
    stages = [
        ("deadline_7d", event.registration_deadline - timedelta(days=7), "Registration closes in 7 days"),
        ("deadline_3d", event.registration_deadline - timedelta(days=3), "Registration deadline is coming up"),
        ("deadline_24h", event.registration_deadline - timedelta(hours=24), "Registration closes tomorrow"),
        ("deadline_1h", event.registration_deadline - timedelta(hours=1), "Registration closes in 1 hour"),
        ("event_start", event.starts_at - timedelta(hours=1), "Your event starts soon"),
    ]
    for stage, when, title in stages:
        for channel in ("in_app", "email", "push"):
            db.session.add(Notification(
                user_id=registration.user_id,
                event_id=event.id,
                channel=channel,
                title=title,
                body=f"{event.title} is on your STUDENOVA schedule.",
                stage=stage,
                scheduled_for=when,
            ))
