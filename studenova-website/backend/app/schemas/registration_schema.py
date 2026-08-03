from marshmallow import fields
from ..extensions import ma
from ..models import Registration


class RegistrationSchema(ma.SQLAlchemyAutoSchema):
    event = fields.Nested(
        "EventSchema",
        only=("id", "title", "starts_at", "ends_at", "registration_deadline", "status"),
        dump_only=True,
    )
    event_title = fields.String(attribute="event.title", dump_only=True)
    student_name = fields.String(attribute="user.name", dump_only=True)
    student_email = fields.String(attribute="user.email", dump_only=True)
    student_college = fields.String(attribute="user.college", dump_only=True)
    student_department = fields.String(attribute="user.profile.department", dump_only=True)
    student_year = fields.String(attribute="user.profile.academic_year", dump_only=True)

    class Meta:
        model = Registration
        include_fk = True
        load_instance = True


registration_schema = RegistrationSchema()
registrations_schema = RegistrationSchema(many=True)
