from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)
from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return {"error": "all fields required"}, 400
    if User.query.filter_by(email=email).first():
        return {"error": "email already registered"}, 409
    u = User(email=email); u.set_password(password)
    db.session.add(u); db.session.commit()
    return {"message": "registered"}, 201

@auth_bp.post("/login")
def login():
    try:
        data = request.get_json(silent=True) or {}
    except Exception as e:
        return {"error": "Invalid JSON"}, 400
    
    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return {"error": "all fields required"}, 400
    
    u = User.query.filter_by(email=email).first()
    if not u:
        return {"error": "invalid credentials"}, 401
    if not u.check_password(password):
        return {"error": "invalid credentials"}, 401
    
    print("Creating tokens...")
    try:
        access = create_access_token(identity=str(u.id))
        refresh = create_refresh_token(identity=str(u.id))
        resp = jsonify({"message": "logged_in"})
        set_access_cookies(resp, access, max_age=60*15)
        set_refresh_cookies(resp, refresh, max_age=60*60*24*7)
        
        return resp, 200
    except Exception as e:
        return {"error": "Login failed"}, 500

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    uid = get_jwt_identity()
    access = create_access_token(identity=uid)
    resp = jsonify({"message": "refreshed"})
    set_access_cookies(resp, access, max_age=60*15)
    return resp, 200

@auth_bp.post("/logout")
def logout():
    resp = jsonify({"message": "logged_out"})
    unset_jwt_cookies(resp)
    return resp, 200

@auth_bp.get("/me")
@jwt_required()
def me():
    uid = get_jwt_identity()
    u = User.query.get_or_404(uid)
    return {"id": u.id, "email": u.email}