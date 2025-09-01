import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function PhotoGallery({ tripId }) {
  const [photos, setPhotos] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try { setPhotos(await api.listPhotos(tripId)); } catch (e) { setErr(e.message); }
  }
  useEffect(() => { load(); }, [tripId]);

  async function remove(id) {
    if (!confirm("Delete this photo?")) return;
    await api.deletePhoto(id);
    setPhotos(p => p.filter(x => x.id !== id));
  }

  if (err) return <div className="text-red-600">{err}</div>;
  if (!photos.length) return <div className="text-sm text-gray-500">No photos yet.</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {photos.map(p => (
        <div key={p.id} className="relative group">
          <img src={p.url} alt={p.caption || "trip photo"} className="w-full h-40 object-cover rounded" />
          <button onClick={() => remove(p.id)}
            className="absolute top-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
