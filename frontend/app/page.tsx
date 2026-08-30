"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [budget, setBudget]           = useState("");
  const [days, setDays]               = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // try {
    //   const res = await fetch("http://localhost:8000/api/v1/trips", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       destination,
    //       days:         Number(days),
    //       budget:       Number(budget),
    //       travel_style: travelStyle,
    //     }),
    //   });
      try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          destination: destination,
          budget: Number(budget),
          days: Number(days),
          travel_style: travelStyle,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Something went wrong");
      }

      await res.json();
      router.push("/trips");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  /* ── Form view ───────────────────────────────────────────── */
  if (!authChecked) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Hero section */}
      <div
        className="relative w-full h-64 sm:h-80 md:h-96 bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url('https://picsum.photos/seed/travel/1600/700')` }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-3 hover:text-indigo-400">
            KelanaAI
          </h1>
          <p className="text-white/90 text-base sm:text-lg lg:text-xl drop-shadow max-w-xl hover:text-indigo-400">
            Your AI-powered travel planner. Tell us where you want to go.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="flex flex-col items-center px-4 py-10 bg-white flex-1">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md md:max-w-2xl lg:max-w-3xl"
        >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Destination */}
          <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
            <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
              DESTINATION
            </label>
            <input
              type="text"
              placeholder="e.g. Japan"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-sm outline-none"
            />
          </div>

          {/* Budget */}
          <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
            <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
              BUDGET (USD)
            </label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-sm outline-none"
            />
          </div>

          {/* Days */}
          <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
            <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
              DAYS
            </label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full bg-transparent text-gray-500 placeholder-gray-400 text-sm outline-none"
            />
          </div>

          {/* Travel Style */}
          <div className="bg-gray-100 rounded-2xl px-4 pt-3 pb-4">
            <label className="block text-xs font-semibold text-blue-400 tracking-widest mb-1">
              TRAVEL STYLE
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-transparent text-gray-500 text-sm outline-none cursor-pointer"
            >
              <option value="" disabled>Select a style</option>
              <option value="Solo">Solo</option>
              <option value="Couple">Couple</option>
              <option value="Family">Family</option>
              <option value="Business">Business</option>
              <option value="Cultural">Cultural</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60
                     transition-colors text-white font-semibold py-4 rounded-2xl
                     flex items-center justify-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? "Generating your trip..." : "Generate AI Trip"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mt-4 p-4 bg-red-50
                        border border-red-200 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}
      </div>
    </main>
  );
}
