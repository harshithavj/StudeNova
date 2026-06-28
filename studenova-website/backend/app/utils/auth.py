from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..models import User


def current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id) if user_id else None


def roles_required(*roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user = current_user()
            if not user or user.role not in roles:
                return jsonify({"message": "You do not have permission to perform this action"}), 403
            if (user.account_status or "active") != "active":
                return jsonify({"message": "This account is not active"}), 403
            if user.role in {"college_admin", "college_organizer", "industry_organizer"} and (user.verification_status or "approved") != "approved":
                return jsonify({"message": "Organizer verification is pending or rejected"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
