from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import User, Trip, Entry

class TripSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Trip
        include_fk = True
        load_instance = True

class EntrySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Entry
        include_fk = True
        load_instance = True
