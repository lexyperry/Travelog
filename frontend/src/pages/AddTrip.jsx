import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import PhotoUploader from "../components/PhotoUploader";
import PhotoGallery from "../components/PhotoGallery"; // optional but nice

export default function AddTrip() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        title: "",
        location: "",
        start_date: "",
        end_date: "",
        status: "Planned",
    });
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const [trip, setTrip] = useState(null); // once created, holds the new trip

    function onChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        setBusy(true);
        try {
            const created = await api.createTrip(form);
            setTrip(created); // created.id will be used by PhotoUploader
        } catch (e) {
            setErr(e.message || "Failed to create trip");
        } finally {
            setBusy(false);
        }
    }

    if (trip) {
        // After creation: show immediate photo upload + continue button
        return (
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Add Photos to “{trip.title}”</h1>
                <p className="text-sm text-gray-600">
                    You can upload a few photos now, or skip and add them later from the trip page.
                </p>

                <PhotoUploader tripId={trip.id} onUploaded={() => {/* gallery auto refresh below */}} />

                <div className="mt-4">
                    <PhotoGallery tripId={trip.id} />
                </div>

                <div className="flex gap-2">
                    <button
                        className="bg-black text-white px-4 py-2 rounded"
                        onClick={() => nav(`/trips/${trip.id}`)}
                    >
                        Continue to Trip
                    </button>
                    <button
                        className="px-4 py-2 rounded border"
                        onClick={() => nav("/")}
                    >
                        Back to Trips
                    </button>
                </div>
            </div>
        );
    }

    // Initial trip form
    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Create a New Trip</h1>
            {err && <div className="text-red-600">{err}</div>}

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Title *</label>
                    <input
                        className="border p-2 w-full rounded"
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        required
                        placeholder="Italy 2025"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Location</label>
                    <input
                        className="border p-2 w-full rounded"
                        name="location"
                        value={form.location}
                        onChange={onChange}
                        placeholder="Rome, Florence, Venice"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Start Date</label>
                        <input
                            type="date"
                            className="border p-2 w-full rounded"
                            name="start_date"
                            value={form.start_date}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">End Date</label>
                        <input
                            type="date"
                            className="border p-2 w-full rounded"
                            name="end_date"
                            value={form.end_date}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select
                        className="border p-2 w-full rounded"
                        name="status"
                        value={form.status}
                        onChange={onChange}
                    >
                        <option>Planned</option>
                        <option>Active</option>
                        <option>Completed</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        className="bg-black text-white px-4 py-2 rounded"
                        disabled={busy}
                    >
                        {busy ? "Creating…" : "Create Trip"}
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded border"
                        onClick={() => nav("/")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
