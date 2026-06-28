from marshmallow import fields
from ..extensions import ma
from ..models import User


class UserSchema(ma.SQLAlchemyAutoSchema):
    verificationStatus = fields.Method("get_verification_status")
    rejectionReason = fields.String(attribute="rejection_reason", dump_only=True)

    class Meta:
        model = User
        exclude = ("password_hash",)
        load_instance = True

    def get_verification_status(self, user):
        return user.verification_status


user_schema = UserSchema()
users_schema = UserSchema(many=True)
