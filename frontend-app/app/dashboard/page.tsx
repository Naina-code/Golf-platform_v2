"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import ScoreForm from "../../components/ScoreForm";
import ScoreChart from "../../components/ScoreChart";
import API from "../../utils/api";

export default function DashboardPage() {
  const router = useRouter();
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "admin";
    } catch {
      return false;
    }
  };

  const fetchData = async () => {
    try {
      const scoresRes = await API.get("/scores");
      setScores(scoresRes.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.push("/login");
        return;
      }
    }

    if (isAdmin()) {
      try {
        const winnersRes = await API.get("/admin/winners");
        setWinners(winnersRes.data || []);
      } catch {
        // ignore
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {scores.length > 0 ? (
          <ScoreChart scores={scores} />
        ) : (
          <div className="bg-gray-800 p-6 rounded-2xl text-gray-400">
            No scores yet. Add your first score below.
          </div>
        )}

        <ScoreForm refresh={fetchData} />

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Your Scores</h2>
          {scores.length === 0 ? (
            <p className="text-gray-400">No scores yet.</p>
          ) : (
            <div className="grid gap-3">
              {scores.map((s) => (
                <div key={s.id} className="bg-gray-800 p-4 rounded-xl flex justify-between">
                  <span className="font-bold text-green-400">Score: {s.score}</span>
                  <span className="text-gray-400">{new Date(s.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Winners</h2>
          {winners.length === 0 ? (
            <p className="text-gray-400">No winners yet.</p>
          ) : (
            <div className="grid gap-3">
              {winners.map((w) => (
                <div key={w.id} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                  <span>Matched: <span className="text-green-400 font-bold">{w.matched_numbers}</span> numbers</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${w.payment_status === "paid" ? "bg-green-600" : "bg-yellow-600"}`}>
                    {w.payment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
