import os
from flask import Flask, jsonify
from datetime import timedelta
from extensions import db, migrate, jwt, CORS
from routes.auth import auth_bp
from routes.trips import trips_bp

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///travelog.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me")
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = bool(int(os.getenv("JWT_COOKIE_SECURE", "0")))
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app,
         origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
         supports_credentials=True)

    @app.get("/api/health")
    def health(): return {"ok": True}

    app.register_blueprint(auth_bp)
    app.register_blueprint(trips_bp)
    return app

app = create_app()
