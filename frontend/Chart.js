"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function ScoreChart({ scores }) {
  // Prepare data
  const labels = scores.map((s) =>
    new Date(s.date).toLocaleDateString()
  );

  const dataValues = scores.map((s) => s.score);

  const data = {
    labels,
    datasets: [
      {
        label: "Score Trend",
        data: dataValues,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
      },
      y: {
        ticks: { color: "white" },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl">
      <h2 className="mb-4 text-xl">Score Analytics</h2>
      <Line data={data} options={options} />
    </div>
  );
}