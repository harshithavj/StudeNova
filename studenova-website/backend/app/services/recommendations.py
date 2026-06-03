from ..models import Event, Registration, User


def recommended_events_for(user: User, limit=8):
    registered_categories = (
        Event.query.join(Registration)
        .filter(Registration.user_id == user.id)
        .with_entities(Event.category)
        .distinct()
        .all()
    )
    categories = [row[0] for row in registered_categories]
    query = Event.query.filter(Event.status == "published")
    if categories:
        query = query.filter(Event.category.in_(categories))
    return query.order_by(Event.popularity_score.desc(), Event.registration_deadline.asc()).limit(limit).all()
