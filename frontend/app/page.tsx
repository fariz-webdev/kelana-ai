"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface TripResponse {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation: string;
}

interface DayPlan {
  title: string;
  body: string;
}

/**
 * Split the markdown AI response into per-day blocks.
 * Handles "## Day 1", "**Day 1**", "Day 1:", "Day 2-3:"
 */
function parseDayPlans(markdown: string): DayPlan[] {
  const parts = markdown.split(/(?=(?:#{1,3}\s*)?(?:\*\*)?Day\s+[\d\-–]+)/im);
  const plans: DayPlan[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [firstLine, ...rest] = trimmed.split("\n");
    const title = firstLine
      .replace(/^#{1,3}\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/:$/, "")
      .trim();
    const body = rest.join("\n").trim();
    if (title) plans.push({ title, body });
  }

  return plans.length ? plans : [{ title: "Itinerary", body: markdown }];
}

/**
 * Picsum Photos — stable, free, no API key needed.
 * Uses a deterministic seed from the destination name so the same
 * destination always gets the same image.
 */
function heroImageUrl(destination: string): string {
  let seed = 0;
  for (let i = 0; i < destination.length; i++) {
    seed = (seed * 31 + destination.charCodeAt(i)) & 0xffff;
  }
  return `https://picsum.photos/seed/${seed}/1200/500`;
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget]           = useState("");
  const [days, setDays]               = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [result, setResult]           = useState<TripResponse | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/v1/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          days:         Number(days),
          budget:       Number(budget),
          travel_style: travelStyle,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Something went wrong");
      }

      setResult(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  /* ── Result view ─────────────────────────────────────────── */
  if (result) {
    const dayPlans = parseDayPlans(result.ai_recommendation ?? "");

    return (
      <main className="min-h-screen bg-white">
        {/* Hero image — full-bleed on all screens */}
        <div
          className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 bg-gray-200 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImageUrl(result.destination)}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
          <div className="absolute inset-0 flex items-end px-4 sm:px-8 pb-4 sm:pb-6 max-w-5xl mx-auto">
            <h1 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">
              KelanaAI
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-full px-4 sm:px-6 py-2.5 mb-6 text-sm font-semibold text-gray-800">
            <span>Destination: {result.destination}</span>
            <span className="text-blue-500">{travelStyle}</span>
            <span>Budget: USD {result.budget.toLocaleString()}</span>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-blue-500 tracking-widest whitespace-nowrap">
              AI RECOMMENDATION
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Day cards — single col on mobile, 2-col grid on md+ */}
          <div className="grid grid-cols-1 gap-3">
            {dayPlans.map((plan, idx) => (
              <div key={idx} className="bg-gray-100 rounded-2xl px-5 py-4">
                <p className="text-blue-500 font-semibold text-sm mb-2">{plan.title}</p>
                <div className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none
                                prose-p:my-1 prose-ul:my-1 prose-ul:pl-4
                                prose-li:my-0.5 prose-li:marker:text-blue-400
                                prose-strong:text-gray-800 prose-strong:font-semibold">
                  <ReactMarkdown>{plan.body}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          {/* Back */}
          <button
            onClick={() => setResult(null)}
            className="mt-6 text-sm text-blue-400 hover:text-blue-600 underline"
          >
            ← Plan another trip
          </button>
        </div>
      </main>
    );
  }

  /* ── Form view ───────────────────────────────────────────── */
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
              <option value="Backpacker">Backpacker</option>
              <option value="Standard">Standard</option>
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
