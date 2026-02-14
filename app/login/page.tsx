"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If already logged in, skip login page
    if (sessionStorage.getItem("auth") === "true") {
      router.replace("/dashboard");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [password]);

  const handleLogin = () => {
    if (password === "tuidhemna") {
      sessionStorage.setItem("auth", "true");
      router.push("/dashboard");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-100 rounded-2xl border border-pink-500/40 bg-black p-6 shadow-[0_0_40px_rgba(255,47,146,0.25)]">
        <h1 className="mb-6 text-center text-2xl font-semibold text-pink-500">
          Login
        </h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-black border border-pink-500/40 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {error && (
          <p className="mt-2 text-sm text-pink-400 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-md bg-pink-500 py-2 font-medium text-black transition hover:bg-pink-400 hover:shadow-[0_0_20px_rgba(255,47,146,0.6)]"
        >
          Enter
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Authorized access only
        </p>
      </div>
    </div>
  );
}
