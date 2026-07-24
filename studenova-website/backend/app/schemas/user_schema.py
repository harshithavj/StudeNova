from marshmallow import fields
from ..extensions import ma
from ..models import User, StudentProfile


class StudentProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = StudentProfile
        load_instance = True
        exclude = ("id", "user_id", "created_at", "updated_at")


class UserSchema(ma.SQLAlchemyAutoSchema):
    verificationStatus = fields.Method("get_verification_status")
    rejectionReason = fields.String(attribute="rejection_reason", dump_only=True)
    profile = fields.Nested(StudentProfileSchema, dump_only=True)

    class Meta:
        model = User
        exclude = ("password_hash",)
        load_instance = True

    def get_verification_status(self, user):
        return user.verification_status


user_schema = UserSchema()
users_schema = UserSchema(many=True)
