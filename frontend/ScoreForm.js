"use client";

import { useState } from "react";
import API from "../utils/api";

export default function ScoreForm({ refresh }) {
  const [score, setScore] = useState("");

  const submitScore = async () => {
    await API.post("/scores", {
      score: Number(score),
      date: new Date(),
    });

    setScore("");
    refresh();
  };

  return (
    <div className="mt-6">
      <input
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Enter score"
        className="p-3 text-black"
      />
      <button onClick={submitScore} className="ml-4 bg-green-500 px-4 py-2">
        Add
      </button>
    </div>
  );
}