"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    if (password === "bookworm") {
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

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-black border border-pink-500/40 px-4 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded text-pink-400 hover:text-pink-300"
          >
            {showPassword ? (
              // eye-off icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12s-3-7-9-7a8.66 8.66 0 0 0-4.9 1.4" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 12s3 7 9 7c2.2 0 4.2-.7 5.9-1.9" />
              </svg>
            ) : (
              // eye icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z" />
                <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

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
