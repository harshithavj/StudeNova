import random
import smtplib
import time
from email.message import EmailMessage

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from marshmallow import Schema, fields, validate
from ...extensions import db, limiter
from ...models import User
from ...schemas import user_schema
from ...utils.auth import current_user

auth_bp = Blueprint("auth", __name__)
otp_store = {}
OTP_TTL_SECONDS = 300


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


class SendOtpSchema(Schema):
    email = fields.Email(required=True)


class ResetPasswordSchema(Schema):
    email = fields.Email(required=True)
    otp = fields.String(required=True, validate=validate.Length(equal=6))
    password = fields.String(required=True, validate=validate.Length(min=8, max=15))


def send_email_otp(email, otp):
    smtp_host = current_app.config.get("SMTP_HOST")
    smtp_port = current_app.config.get("SMTP_PORT")
    smtp_username = current_app.config.get("SMTP_USERNAME")
    smtp_password = current_app.config.get("SMTP_PASSWORD")
    mail_from = current_app.config.get("MAIL_FROM")
    if not smtp_host or not smtp_port or not mail_from:
        return False, "Email OTP is not configured. Add SMTP credentials and restart the backend."

    message = EmailMessage()
    message["Subject"] = "Your STUDENOVA OTP"
    message["From"] = mail_from
    message["To"] = email
    message.set_content(f"Your STUDENOVA OTP is {otp}. It expires in 5 minutes.")

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as smtp:
            if current_app.config.get("SMTP_USE_TLS"):
                smtp.starttls()
            if smtp_username and smtp_password:
                smtp.login(smtp_username, smtp_password.replace(" ", ""))
            smtp.send_message(message)
            return True, None
    except smtplib.SMTPAuthenticationError:
        current_app.logger.exception("Failed to authenticate with SMTP server")
        return False, "Email login failed. Check SMTP_USERNAME and your Gmail App Password."
    except (OSError, smtplib.SMTPException):
        current_app.logger.exception("Failed to send OTP email")
        return False, "Unable to send OTP email. Check SMTP settings and try again."


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


@auth_bp.post("/send-otp")
@limiter.limit("5 per minute")
def send_otp():
    payload = SendOtpSchema().load(request.get_json() or {})
    email = payload["email"].lower()
    otp = f"{random.randint(0, 999999):06d}"
    sent, error_message = send_email_otp(email, otp)
    if not sent:
        return jsonify({"message": error_message}), 503
    otp_store[email] = {"otp": otp, "expires_at": time.time() + OTP_TTL_SECONDS}
    return jsonify({"message": "OTP sent", "email": email})


@auth_bp.post("/verify-otp")
def verify_otp():
    payload = request.get_json() or {}
    if not payload.get("otp"):
        return jsonify({"message": "OTP is required"}), 400
    email = payload.get("email")
    if email:
        email = email.lower()
        otp_entry = otp_store.get(email)
        if not otp_entry or otp_entry["expires_at"] < time.time():
            otp_store.pop(email, None)
            return jsonify({"message": "OTP expired. Please request a new OTP."}), 400
        if otp_entry["otp"] != payload["otp"]:
            return jsonify({"message": "Invalid OTP"}), 400
        otp_store.pop(email, None)
    return jsonify({"message": "OTP accepted", "verified": True})


@auth_bp.post("/forgot-password")
@limiter.limit("5 per minute")
def forgot_password():
    payload = SendOtpSchema().load(request.get_json() or {})
    email = payload["email"].lower()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "No account found for this email"}), 404

    otp = f"{random.randint(0, 999999):06d}"
    sent, error_message = send_email_otp(email, otp)
    if not sent:
        return jsonify({"message": error_message}), 503
    otp_store[email] = {"otp": otp, "expires_at": time.time() + OTP_TTL_SECONDS, "purpose": "password_reset"}
    return jsonify({"message": "Password reset OTP sent", "email": email})


@auth_bp.post("/reset-password")
@limiter.limit("5 per minute")
def reset_password():
    payload = ResetPasswordSchema().load(request.get_json() or {})
    email = payload["email"].lower()
    otp_entry = otp_store.get(email)
    if not otp_entry or otp_entry["expires_at"] < time.time() or otp_entry.get("purpose") != "password_reset":
        otp_store.pop(email, None)
        return jsonify({"message": "OTP expired. Please request a new reset code."}), 400
    if otp_entry["otp"] != payload["otp"]:
        return jsonify({"message": "Invalid OTP"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "No account found for this email"}), 404
    user.set_password(payload["password"])
    otp_store.pop(email, None)
    db.session.commit()
    return jsonify({"message": "Password updated. You can login with your new password."})


@auth_bp.get("/me")
@jwt_required()
def me():
    return jsonify({"user": user_schema.dump(current_user())})
