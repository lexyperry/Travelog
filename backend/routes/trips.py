from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Trip, Entry
from schema import TripSchema, EntrySchema

trips_bp = Blueprint("trips", __name__, url_prefix="/api")
trip_schema = TripSchema()
trips_schema = TripSchema(many=True)
entry_schema = EntrySchema()
entries_schema = EntrySchema(many=True)

def _owned_trip_or_404(trip_id, uid):
    return Trip.query.filter_by(id=trip_id, user_id=uid).first_or_404()

@trips_bp.get("/trips")
@jwt_required()
def list_trips():
    uid = get_jwt_identity()
    trips = Trip.query.filter_by(user_id=uid).order_by(Trip.start_date).all()
    return trips_schema.dump(trips)

@trips_bp.post("/trips")
@jwt_required()
def create_trip():
    uid = get_jwt_identity()
    data = request.get_json() or {}
    t = Trip(user_id=uid, **{k: data.get(k) for k in
          ["title","location","start_date","end_date","status"]})
    db.session.add(t); db.session.commit()
    return trip_schema.dump(t), 201

@trips_bp.get("/trips/<int:trip_id>")
@jwt_required()
def get_trip(trip_id):
    uid = get_jwt_identity()
    t = _owned_trip_or_404(trip_id, uid)
    return trip_schema.dump(t)

@trips_bp.patch("/trips/<int:trip_id>")
@jwt_required()
def update_trip(trip_id):
    uid = get_jwt_identity()
    t = _owned_trip_or_404(trip_id, uid)
    data = request.get_json() or {}
    for field in ["title","location","start_date","end_date","status"]:
        if field in data: setattr(t, field, data[field])
    db.session.commit()
    return trip_schema.dump(t)

@trips_bp.delete("/trips/<int:trip_id>")
@jwt_required()
def delete_trip(trip_id):
    uid = get_jwt_identity()
    t = _owned_trip_or_404(trip_id, uid)
    db.session.delete(t); db.session.commit()
    return {"deleted": trip_id}, 200

# Entries (nested)
@trips_bp.get("/trips/<int:trip_id>/entries")
@jwt_required()
def list_entries(trip_id):
    uid = get_jwt_identity()
    _owned_trip_or_404(trip_id, uid)
    entries = Entry.query.filter_by(trip_id=trip_id).order_by(Entry.date).all()
    return entries_schema.dump(entries)

@trips_bp.post("/trips/<int:trip_id>/entries")
@jwt_required()
def create_entry(trip_id):
    uid = get_jwt_identity()
    _owned_trip_or_404(trip_id, uid)
    data = request.get_json() or {}
    e = Entry(trip_id=trip_id, **{k: data.get(k) for k in ["date","text","place"]})
    db.session.add(e); db.session.commit()
    return entry_schema.dump(e), 201

@trips_bp.patch("/entries/<int:entry_id>")
@jwt_required()
def update_entry(entry_id):
    uid = get_jwt_identity()
    e = Entry.query.get_or_404(entry_id)
    _owned_trip_or_404(e.trip_id, uid)
    data = request.get_json() or {}
    for field in ["date","text","place"]:
        if field in data: setattr(e, field, data[field])
    db.session.commit()
    return entry_schema.dump(e)

@trips_bp.delete("/entries/<int:entry_id>")
@jwt_required()
def delete_entry(entry_id):
    uid = get_jwt_identity()
    e = Entry.query.get_or_404(entry_id)
    _owned_trip_or_404(e.trip_id, uid)
    db.session.delete(e); db.session.commit()
    return {"deleted": entry_id}, 200
