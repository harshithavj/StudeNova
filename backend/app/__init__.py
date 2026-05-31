import logging
from flask import Flask, jsonify, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from .config import Config
from .extensions import cors, db, jwt, limiter, ma, migrate


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGINS"]}}, supports_credentials=True)
    limiter.init_app(app)

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")

    from .blueprints.auth.routes import auth_bp
    from .blueprints.events.routes import events_bp
    from .blueprints.registrations.routes import registrations_bp
    from .blueprints.notifications.routes import notifications_bp
    from .blueprints.bookmarks.routes import bookmarks_bp
    from .blueprints.analytics.routes import analytics_bp
    from .blueprints.search.routes import search_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(registrations_bp, url_prefix="/api/registrations")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(bookmarks_bp, url_prefix="/api/bookmarks")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(search_bp, url_prefix="/api/search")

    if app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite:///"):
        with app.app_context():
            from . import models  # noqa: F401

            db.create_all()

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "studenova-api"}

    @app.post("/api/register-event")
    @jwt_required()
    def register_event_alias():
        from .blueprints.registrations.routes import register_for_event
        event_id = (request.get_json() or {}).get("event_id")
        if not event_id:
            return jsonify({"message": "event_id is required"}), 400
        return register_for_event(int(event_id))

    @app.get("/api/my-registrations")
    @jwt_required()
    def my_registrations_alias():
        from .blueprints.registrations.routes import my_registrations
        return my_registrations()

    @app.post("/api/bookmark")
    @jwt_required()
    def bookmark_alias():
        from .blueprints.bookmarks.routes import save_event
        event_id = (request.get_json() or {}).get("event_id")
        if not event_id:
            return jsonify({"message": "event_id is required"}), 400
        return save_event(int(event_id))

    @app.get("/api/bookmarks")
    @jwt_required()
    def bookmarks_alias():
        from .blueprints.bookmarks.routes import list_bookmarks
        return list_bookmarks()

    @app.delete("/api/bookmark/<int:event_id>")
    @jwt_required()
    def delete_bookmark_alias(event_id):
        from .blueprints.bookmarks.routes import unsave_event
        return unsave_event(event_id)

    @app.put("/api/notifications/<int:notification_id>/read")
    @jwt_required()
    def notification_read_alias(notification_id):
        from .blueprints.notifications.routes import mark_read
        return mark_read(notification_id)

    @app.errorhandler(ValidationError)
    def handle_validation(error):
        return jsonify({"message": "Validation failed", "errors": error.messages}), 422

    @app.errorhandler(SQLAlchemyError)
    def handle_database(error):
        app.logger.exception("Database error: %s", error)
        db.session.rollback()
        return jsonify({"message": "Database operation failed"}), 500

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"message": "Resource not found"}), 404

    return app
