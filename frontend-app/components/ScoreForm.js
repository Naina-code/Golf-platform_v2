"use client";

import { useState } from "react";
import API from "../utils/api";

export default function ScoreForm({ refresh }) {
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitScore = async () => {
    if (!score) return;
    setError("");
    setLoading(true);
    try {
      await API.post("/scores", {
        score: Number(score),
        date: new Date().toISOString().split("T")[0],
      });
      setScore("");
      refresh();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex gap-3">
        <input
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Enter score (1-45)"
          type="number"
          className="p-3 rounded-lg bg-white text-black w-48 border border-gray-300"
        />
        <button
          onClick={submitScore}
          disabled={loading}
          className="bg-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Score"}
        </button>
      </div>
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
}
