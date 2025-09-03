import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import PhotoUploader from "../components/PhotoUploader";
import PhotoGallery from "../components/PhotoGallery";

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  //call the get API every time the id parameter is updated/changed
  useEffect(() => { api.getTrip(id).then(setTrip); }, [id]);

  if (!trip) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{trip.title}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Photos</h2>
          <PhotoUploader tripId={id} onUploaded={() => { }} />
          <div className="mt-4">
            <PhotoGallery tripId={id} />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">Location: {trip.location || "-"}</p>
        </div>
      </div>
    </div>
  );
}
