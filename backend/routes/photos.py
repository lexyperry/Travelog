from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Trip, Photo

photos_bp = Blueprint("photos", __name__, url_prefix="/api")

def _owned_trip_or_404(trip_id, uid):
    return Trip.query.filter_by(id=trip_id, user_id=uid).first_or_404()

@photos_bp.get("/trips/<int:trip_id>/photos")
@jwt_required()
def list_photos(trip_id):
    uid = get_jwt_identity()
    _owned_trip_or_404(trip_id, uid)
    photos = Photo.query.filter_by(trip_id=trip_id).order_by(Photo.created_at.desc()).all()
    return [{"id": p.id, "url": p.url, "provider_id": p.provider_id, "caption": p.caption} for p in photos], 200

@photos_bp.post("/trips/<int:trip_id>/photos")
@jwt_required()
def create_photo(trip_id):
    uid = get_jwt_identity()
    _owned_trip_or_404(trip_id, uid)
    data = request.get_json() or {}
    if not data.get("url") or not data.get("provider_id"):
        return {"error":"url and provider_id required"}, 400
    p = Photo(user_id=uid, trip_id=trip_id, url=data["url"], provider_id=data["provider_id"], caption=data.get("caption"))
    db.session.add(p); db.session.commit()
    return {"id": p.id, "url": p.url, "provider_id": p.provider_id, "caption": p.caption}, 201

@photos_bp.delete("/photos/<int:photo_id>")
@jwt_required()
def delete_photo(photo_id):
    uid = get_jwt_identity()
    p = Photo.query.get_or_404(photo_id)
    _owned_trip_or_404(p.trip_id, uid)
    db.session.delete(p); db.session.commit()
    return {"deleted": photo_id}, 200
