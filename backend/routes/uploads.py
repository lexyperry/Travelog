import os, time, cloudinary, cloudinary.utils
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Trip

uploads_bp = Blueprint("uploads", __name__, url_prefix="/api/uploads")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

def require_cloudinary_config():
    cfg = cloudinary.config()
    if not cfg.cloud_name or not cfg.api_key or not cfg.api_secret:
        return False, {"error": "cloudinary_misconfigured",
                       "message": "Missing CLOUDINARY_* env vars on server"}
    return True, cfg

@uploads_bp.post("/sign")
@jwt_required()
def sign():
    ok, cfg = require_cloudinary_config()
    if not ok:
        return cfg,500
    
    uid = get_jwt_identity()
    trip_id = request.args.get("trip_id", type=int)
    if not trip_id:
        return {"error": "trip_id required"}, 400
    
    Trip.query.filter_by(id=trip_id, user_id=uid).first_or_404()
    
    timestamp = int(time.time())
    folder = f"{os.getenv('CLOUDINARY_UPLOAD_FOLDER','travelog')}/{uid}/{trip_id}"
    params_to_sign = {"timestamp": timestamp, "folder": folder}
    signature = cloudinary.utils.api_sign_request(params_to_sign, cfg.api_secret)
    
    return {
        "timestamp": timestamp,
        "signature": signature,
        "api_key": cfg.api_key,
        "cloud_name": cfg.cloud_name,
        "folder": folder
    }, 200