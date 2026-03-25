"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="flex justify-between p-6 bg-black text-white border-b border-gray-800">
      <h1 className="font-bold text-xl">GolfX</h1>
      <div className="space-x-6 flex items-center">
        <Link href="/">Home</Link>
        {loggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout} className="text-gray-400 hover:text-white">Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
