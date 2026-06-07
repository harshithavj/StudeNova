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
    from .blueprints.admin.routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
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
            sync_sqlite_schema(app)
            backfill_sqlite_defaults(app)

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


def sync_sqlite_schema(app):
    """Add model columns missing from an existing local SQLite dev database."""
    from sqlalchemy import inspect, text
    from sqlalchemy.schema import CreateColumn

    inspector = inspect(db.engine)
    existing_tables = set(inspector.get_table_names())
    with db.engine.begin() as connection:
        for table in db.metadata.sorted_tables:
            if table.name not in existing_tables:
                continue
            existing_columns = {column["name"] for column in inspector.get_columns(table.name)}
            for column in table.columns:
                if column.name in existing_columns:
                    continue
                compiled_column = str(CreateColumn(column).compile(dialect=db.engine.dialect))
                compiled_column = compiled_column.replace(" NOT NULL", "")
                app.logger.info("Adding missing SQLite column %s.%s", table.name, column.name)
                connection.execute(text(f'ALTER TABLE "{table.name}" ADD COLUMN {compiled_column}'))


def backfill_sqlite_defaults(app):
    from sqlalchemy import inspect, text

    inspector = inspect(db.engine)
    columns_by_table = {
        table_name: {column["name"] for column in inspector.get_columns(table_name)}
        for table_name in inspector.get_table_names()
    }
    with db.engine.begin() as connection:
        if "account_status" in columns_by_table.get("users", set()):
            result = connection.execute(
                text("UPDATE users SET account_status = 'active' WHERE account_status IS NULL OR account_status = ''")
            )
            if result.rowcount:
                app.logger.info("Backfilled %s user account status value(s)", result.rowcount)
