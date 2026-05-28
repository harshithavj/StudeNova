from marshmallow import fields
from ..extensions import ma
from ..models import Registration


class RegistrationSchema(ma.SQLAlchemyAutoSchema):
    event_title = fields.String(attribute="event.title", dump_only=True)

    class Meta:
        model = Registration
        include_fk = True
        load_instance = True


registration_schema = RegistrationSchema()
registrations_schema = RegistrationSchema(many=True)
