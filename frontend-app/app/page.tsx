"use client";

import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { generateMLDraw } from "../utils/api";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleMLDraw = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await generateMLDraw(token);
      setResult(data);
    } catch (err) {
      alert("Error generating draw");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold"
        >
          Play. Win. Give Back.
        </motion.h1>
        <p className="mt-4 text-gray-400 text-lg">
          Turn your golf scores into rewards & real-world impact.
        </p>
        <button className="mt-8 px-8 py-3 bg-green-500 rounded-xl font-semibold hover:bg-green-600">
          Subscribe Now
        </button>
      </section>

      <section className="text-center py-10 px-6">
        <h2 className="text-2xl font-semibold mb-4">Admin Controls</h2>
        <button
          onClick={handleMLDraw}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate AI Draw"}
        </button>
        {result && (
          <pre className="mt-6 bg-gray-900 p-4 rounded-xl text-left overflow-x-auto max-w-xl mx-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </section>

      <section className="grid md:grid-cols-4 gap-6 p-10">
        {["Enter Scores", "Join Draw", "Win Rewards", "Support Charity"].map((item) => (
          <div key={item} className="bg-gray-800 p-6 rounded-xl text-center font-semibold">
            {item}
          </div>
        ))}
      </section>

      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-8">Pricing</h2>
        <div className="flex justify-center gap-10 flex-wrap">
          <div className="bg-gray-800 p-8 rounded-xl w-48">
            <h3 className="font-semibold text-lg">Monthly</h3>
            <p className="text-3xl font-bold mt-2">₹499</p>
          </div>
          <div className="bg-green-600 p-8 rounded-xl w-48">
            <h3 className="font-semibold text-lg">Yearly</h3>
            <p className="text-3xl font-bold mt-2">₹4999</p>
          </div>
        </div>
      </section>
    </div>
  );
}
