from datetime import timedelta
from ..extensions import db
from ..models import Notification, Registration


def schedule_registration_reminders(registration: Registration):
    event = registration.event
    stages = [
        ("deadline_72h", event.registration_deadline - timedelta(hours=72), "Registration deadline is coming up"),
        ("deadline_24h", event.registration_deadline - timedelta(hours=24), "Registration closes tomorrow"),
        ("event_2h", event.starts_at - timedelta(hours=2), "Your event starts soon"),
    ]
    for stage, when, title in stages:
        db.session.add(Notification(
            user_id=registration.user_id,
            event_id=event.id,
            title=title,
            body=f"{event.title} is on your STUDENOVA schedule.",
            stage=stage,
            scheduled_for=when,
        ))
