import React, { useRef, useState } from "react";
import { api } from "../lib/api";

export default function PhotoUploader({ tripId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  async function upload() {
    if (!file || busy) return;
    setBusy(true); setErr("");
    try {
      const sign = await api.signUpload(tripId);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sign.api_key);
      fd.append("timestamp", String(sign.timestamp));
      fd.append("signature", sign.signature);
      if (sign.folder) fd.append("folder", sign.folder);

      const cloudUrl = `https://api.cloudinary.com/v1_1/${sign.cloud_name}/image/upload`;
      const res = await fetch(cloudUrl, { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

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
    <div className="border p-4 rounded-lg bg-white">
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openPicker}
          disabled={busy}
          className={`px-4 py-2 rounded-lg text-black transition
            ${busy ? "bg-indigo-300 cursor-not-allowed"
                   : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"}`}
        >
          Choose Image
        </button>

        {/* Filename (replaces “No file chosen”) */}
        <span
          className={`text-sm ${file ? "text-black-700" : "text-black-500 italic"}`}
          aria-live="polite"
        >
          {file ? file.name : "No file chosen"}
        </span>

        {/* Upload button */}
        <button
          type="button"
          onClick={upload}
          disabled={!file || busy}
          className={`bg-blue-600 text-darkgray-600 ml-auto px-4 py-2 rounded-lg transition
            ${!file || busy
              ? "bg-blue-600 text-darkgray-600 cursor-not-allowed"
              : "bg-blue-600 text-darkgray-600 hover:bg-blue-700 text-white shadow-sm"}`}
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>

      {err && <div className="text-red-600 mt-2 text-sm">{err}</div>}
    </div>
  );
}
