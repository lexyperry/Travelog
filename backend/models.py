from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    trips = db.relationship("Trip", backref="user", cascade="all, delete-orphan")

    def set_password(self, pw): self.password_hash = generate_password_hash(pw)
    def check_password(self, pw): return check_password_hash(self.password_hash, pw)

class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(20), default="Planned")  # Planned/Active/Completed
    public_slug = db.Column(db.String(64), unique=True)

    entries = db.relationship("Entry", backref="trip", cascade="all, delete-orphan")

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trip.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    text = db.Column(db.Text, default="")
    place = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Photo & TripSummary can be added after MVP (or now if you want).
# ...existing imports/classes...
class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey("trip.id"), nullable=False)
    entry_id = db.Column(db.Integer, db.ForeignKey("entry.id"), nullable=True)
    url = db.Column(db.String(500), nullable=False)
    provider_id = db.Column(db.String(200), nullable=False)  # Cloudinary public_id
    caption = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    trip = db.relationship("Trip", backref="photos")
