"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-6 bg-black text-white">
      <h1 className="font-bold text-xl">GolfX</h1>
      <div className="space-x-6">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}