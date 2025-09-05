import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Logout from "../components/Logout"

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const nav = useNavigate();

    //set trips when page is loaded for the first time
    async function load() {
        setErr("");
        try {
            const data = await api.listTrips();
            setTrips(data || []);
        } catch (e) {
            setErr(e.message || "Failed to load trips");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function remove(id) {
        if (!confirm("Delete this trip?")) return;
        try {
            await api.deleteTrip(id);
            setTrips(prev => prev.filter(t => t.id !== id));
        } catch (e) {
            alert(e.message || "Delete failed");
        }
    }

    if (loading) return <div className="p-6">Loading…</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Logout></Logout>
                <h1 className="text-2xl font-semibold">My Trips</h1>
                <button
                    onClick={() => nav("/trips/new")}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    + Add Trip
                </button>
            </div>

            {err && <div className="text-red-600">{err}</div>}

            {!trips.length ? (
                <div className="text-sm text-gray-600">
                    You don’t have any trips yet. Click <span className="font-medium">+ Add Trip</span> to create one.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {trips.map(t => (
                        <div key={t.id} className="border rounded p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">{t.title}</h2>
                                <span className="text-xs px-2 py-1 rounded bg-gray-100">{t.status || "Planned"}</span>
                            </div>    
                            <div className="text-sm text-gray-600">
                                {t.location || "—"}{t.start_date ? ` • ${t.start_date}` : ""}{t.end_date ? ` → ${t.end_date}` : ""}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Link
                                    to={`/trips/${t.id}`}
                                    className="px-3 py-1 rounded border"
                                >
                                    Open
                                </Link>
                                <button
                                    onClick={() => remove(t.id)}
                                    className="px-3 py-1 rounded border text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
