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
 * Looks for headings like "## Day 1", "**Day 1**", or "Day 1:"
 */
function parseDayPlans(markdown: string): DayPlan[] {
  // Split on lines that look like a day heading
  const parts = markdown.split(/(?=(?:#{1,3}\s*|^\*\*)?Day\s+\d+)/im);
  const plans: DayPlan[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Extract the first line as the title
    const [firstLine, ...rest] = trimmed.split("\n");
    const title = firstLine
      .replace(/^#{1,3}\s*/, "")   // strip markdown headings
      .replace(/\*\*/g, "")         // strip bold markers
      .trim();
    const body = rest.join("\n").trim();

    if (title) plans.push({ title, body });
  }

  // Fallback: single block
  if (plans.length === 0) {
    return [{ title: "Itinerary", body: markdown }];
  }

  return plans;
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [result, setResult] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          days: Number(days),
          budget: Number(budget),
          travel_style: travelStyle,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Something went wrong");
      }

      const data: TripResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  }

  /* ── Result view ─────────────────────────────────────────── */
  if (result) {
    const dayPlans = parseDayPlans(result.ai_recommendation ?? "");

    return (
      <main className="min-h-screen bg-white px-5 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-blue-500 mb-4">KelanaAI</h1>

        {/* Summary pill */}
        <div className="flex items-center justify-between border border-gray-200 rounded-full px-5 py-3 mb-6 text-sm font-semibold text-gray-800">
          <span>Destination: {result.destination}</span>
          <span>Budget: USD {result.budget.toLocaleString()}</span>
        </div>

        {/* AI Recommendation section */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-teal-600 tracking-widest whitespace-nowrap">
            AI RECOMMENDATION
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          {dayPlans.map((plan, idx) => (
            <div key={idx} className="bg-gray-100 rounded-2xl px-5 py-4">
              <p className="text-blue-500 font-bold text-sm mb-2">{plan.title}</p>
              <div className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none
                              prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-gray-700">
                <ReactMarkdown>{plan.body}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => setResult(null)}
          className="mt-6 text-sm text-blue-400 hover:text-blue-600 underline"
        >
          ← Plan another trip
        </button>
      </main>
    );
  }

  /* ── Form view ───────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-500 mb-1">KelanaAI</h1>
      <p className="text-gray-400 text-sm mb-8">Plan your next adventure</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-3">
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
            <option value="" disabled>
              Select a style
            </option>
            <option value="Backpacker">Backpacker</option>
            <option value="Standard">Standard</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60 transition-colors text-white font-semibold py-4 rounded-2xl mt-1 flex items-center justify-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading ? "Generating your trip..." : "Generate AI Trip"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="w-full max-w-md mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}
    </main>
  );
}
