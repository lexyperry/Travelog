import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import PhotoUploader from "../components/PhotoUploader";
import PhotoGallery from "../components/PhotoGallery";

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [err, setErr] = useState("");
  const [refresh, setRefresh] = useState(0); // triggers gallery refresh

  // load trip when id changes
  useEffect(() => {
    let alive = true;
    setErr("");
    setTrip(null);
    (async () => {
      try {
        const t = await api.getTrip(id);
        if (alive) setTrip(t);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load trip");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!trip) return <div className="p-6">Loading…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
          <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {trip.status || "Planned"}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-700">Location:</span>{" "}
            {trip.location || "—"}
          </p>
          {(trip.start_date || trip.end_date) && (
            <p className="mt-1">
              <span className="font-medium text-gray-700">Dates:</span>{" "}
              {trip.start_date || "—"}{trip.end_date ? ` → ${trip.end_date}` : ""}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h2 className="font-semibold text-gray-800 mb-3">Photos</h2>
            <PhotoUploader
              tripId={id}
              onUploaded={() => setRefresh(r => r + 1)} // refresh gallery
            />
            <div className="mt-4">
              {/* key forces re-mount so it re-queries */}
              <PhotoGallery key={`${id}-${refresh}`} tripId={id} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border">
            <h2 className="font-semibold text-gray-800 mb-3">Details</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Title: {trip.title}</li>
              <li>Location: {trip.location || "—"}</li>
              <li>Status: {trip.status || "Planned"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
