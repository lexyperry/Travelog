import { useState } from "react";
import { api } from "../lib/api";

export default function PhotoUploader({ tripId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload() {
    if (!file) return;
    setBusy(true); setErr("");
    try {
      // 1) Get signed params from backend
      const sign = await api.signUpload(tripId);

      // 2) Send file directly to Cloudinary
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sign.api_key);
      fd.append("timestamp", sign.timestamp);
      fd.append("signature", sign.signature);
      fd.append("folder", sign.folder);
      const cloudUrl = `https://api.cloudinary.com/v1_1/${sign.cloud_name}/image/upload`;

      const res = await fetch(cloudUrl, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Cloud upload failed");
      const data = await res.json(); // has secure_url, public_id

      // 3) Save metadata in our DB
      await api.savePhoto(tripId, { url: data.secure_url, provider_id: data.public_id });
      setFile(null);
      onUploaded?.();
    } catch (e) {
      setErr(e.message || "Upload error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border p-3 rounded">
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button disabled={!file || busy} onClick={upload} className="bg-black text-white px-3 py-1 rounded">
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
      {err && <div className="text-red-600 mt-2 text-sm">{err}</div>}
    </div>
  );
}
