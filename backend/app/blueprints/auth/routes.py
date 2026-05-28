from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from marshmallow import Schema, fields, validate
from ...extensions import db, limiter
from ...models import User
from ...schemas import user_schema
from ...utils.auth import current_user

auth_bp = Blueprint("auth", __name__)


class SignupSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=8))
    role = fields.String(required=True, validate=validate.OneOf(["student", "college_admin", "industry_organizer"]))
    college = fields.String(load_default=None, allow_none=True)
    company = fields.String(load_default=None, allow_none=True)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


@auth_bp.post("/signup")
@limiter.limit("10 per minute")
def signup():
    payload = SignupSchema().load(request.get_json() or {})
    if User.query.filter_by(email=payload["email"].lower()).first():
        return jsonify({"message": "Email is already registered"}), 409
    user = User(
        name=payload["name"],
        email=payload["email"].lower(),
        role=payload["role"],
        college=payload.get("college"),
        company=payload.get("company"),
    )
    user.set_password(payload["password"])
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return jsonify({"access_token": token, "user": user_schema.dump(user)}), 201


@auth_bp.post("/login")
@limiter.limit("10 per minute")
def login():
    payload = LoginSchema().load(request.get_json() or {})
    user = User.query.filter_by(email=payload["email"].lower()).first()
    if not user or not user.check_password(payload["password"]):
        return jsonify({"message": "Invalid email or password"}), 401
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return jsonify({"access_token": token, "user": user_schema.dump(user)})


@auth_bp.post("/logout")
@jwt_required(optional=True)
def logout():
    return jsonify({"message": "Session cleared on client"})


@auth_bp.post("/verify-otp")
def verify_otp():
    payload = request.get_json() or {}
    if not payload.get("otp"):
        return jsonify({"message": "OTP is required"}), 400
    return jsonify({"message": "OTP accepted", "verified": True})


@auth_bp.get("/me")
@jwt_required()
def me():
    return jsonify({"user": user_schema.dump(current_user())})
