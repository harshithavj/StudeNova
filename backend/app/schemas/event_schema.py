from marshmallow import fields, validate
from ..extensions import ma
from ..models import Event, Tag


class TagSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Tag
        load_instance = True


class EventSchema(ma.SQLAlchemyAutoSchema):
    tags = fields.Method("get_tags")
    organizer_name = fields.String(attribute="organizer.name", dump_only=True)
    registrations_count = fields.Method("get_registrations_count")

    class Meta:
        model = Event
        include_fk = True
        load_instance = True

    def get_tags(self, event):
        return [tag.name for tag in event.tags]

    def get_registrations_count(self, event):
        return len(event.registrations)


class EventCreateSchema(ma.Schema):
    title = fields.String(required=True, validate=validate.Length(min=3, max=180))
    description = fields.String(required=True, validate=validate.Length(min=20))
    category = fields.String(required=True)
    mode = fields.String(required=True, validate=validate.OneOf(["online", "offline", "hybrid"]))
    location = fields.String(required=True)
    college = fields.String(load_default=None)
    eligibility = fields.String(load_default=None)
    seats_available = fields.Integer(load_default=0)
    registration_link = fields.Url(load_default=None, allow_none=True)
    poster_url = fields.Url(load_default=None, allow_none=True)
    starts_at = fields.DateTime(required=True)
    ends_at = fields.DateTime(load_default=None, allow_none=True)
    registration_deadline = fields.DateTime(required=True)
    tags = fields.List(fields.String(), load_default=[])


event_schema = EventSchema()
events_schema = EventSchema(many=True)
event_create_schema = EventCreateSchema()
