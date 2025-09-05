import { useNavigate } from "react-router-dom";
import React from "react";

export default function BackButton({ fallback="/trips", children="Go back", className="" }) {
  const nav = useNavigate();
  const onClick = () => (window.history.length > 1 ? nav(-1) : nav(fallback));
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition ${className}`}
    >
      <span aria-hidden>←</span>{children}
    </button>
  );
}
