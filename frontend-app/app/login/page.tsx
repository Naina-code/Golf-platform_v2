"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    setLoading(true);
    try {
      const url = `http://localhost:8080/api/auth/${mode}`;
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.msg || JSON.stringify(data));
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        {mode === "register" && (
          <input
            className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        <button
          onClick={handle}
          disabled={loading}
          className="w-full py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "..." : mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-center mt-6 text-gray-400">
          {mode === "login" ? "No account?" : "Have an account?"}{" "}
          <button
            className="text-green-400 hover:underline"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
