from ..extensions import ma
from ..models import Notification


class NotificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        include_fk = True
        load_instance = True


notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)
